import { Command, Flags, Interfaces } from '@oclif/core'
import clipboard from 'clipboardy'
import { Issue } from "jira.js/out/version3/models/issue.js";

import { GHClient } from "./gh-client/index.js";
import { GitClient } from './git-client/index.js';
import { JiraClient } from "./jira-client/index.js";

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<T['flags'] & typeof JgCommand['baseFlags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

type ExtractedIssueData = {
  scopes: string[]
  summary: string
  type: string
}

export abstract class JgCommand<T extends typeof Command> extends Command {
  static baseFlags = {
    clipboard: Flags.boolean({ char: 'c', default: false, description: 'Copy to clipboard' }),
    help: Flags.help({ char: 'h', description: 'Show help' }),
    quiet: Flags.boolean({ char: 'q', dependsOn: ['clipboard'], description: 'Suppress output' }),
  }

  static enableJsonFlag = true

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --clipboard',
    '<%= config.bin %> <%= command.id %> --clipboard --quiet',
    '<%= config.bin %> <%= command.id %> --json',
  ]

  protected args!: Args<T>
  protected flags!: Flags<T>
  protected jiraIssueKey!: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async catch(err: { exitCode?: number } & Error): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  copyToClipboard(data: string) {
    clipboard.writeSync(data)
  }

  async fetchIssue(issueIdOrKey: string): Promise<Issue> {
    const issue = await JiraClient.issues.getIssue({ issueIdOrKey })
    return issue
  }

  public async fetchRelatedIssues(issueIdOrKey: string): Promise<string[]> {
    const openPRs = await GHClient.rest.search.issuesAndPullRequests({
      q: `type:pr is:open ${issueIdOrKey} assignee:@me`,
    })
    const mergedPRs = await GHClient.rest.search.issuesAndPullRequests({
      q: `type:pr is:merged ${issueIdOrKey} assignee:@me`,
    })
    const relatedPRs = [...openPRs.data.items, ...mergedPRs.data.items]

    if (relatedPRs.length === 0) {
      return []
    }

    return relatedPRs.map((pr) => pr.pull_request?.html_url as string)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }

  async getExtractedIssueData(issueKey: string): Promise<ExtractedIssueData> {
    const issue = await this.fetchIssue(issueKey)
    const issueScopeAndSummary = this.getIssueScopeAndSummary(issue)
      .replaceAll('->', ':')
      .replaceAll('-', ':')

    const lastScopeIndex = issueScopeAndSummary.lastIndexOf(':')

    const scopesString = lastScopeIndex === -1 ? '' : `${issueScopeAndSummary.slice(0, Math.max(0, lastScopeIndex))}`
      .replaceAll(/\s+/g, ' ')
      .replaceAll(/\s*:\s*/g, ':')
      .replaceAll(/\s+$/g, '')

    const scopes = scopesString.split(':').filter(Boolean)

    const summary = issueScopeAndSummary.slice(Math.max(0, lastScopeIndex + 1))
      .replaceAll(/^\s+/g, '')
      .replaceAll(/\s+$/g, '')

    const type = this.getIssueType(issue)

    return {
      scopes,
      summary,
      type,
    }
  }

  getIssueScopeAndSummary(issue: Issue): string {
    const { summary } = issue.fields
    const formattedSummary = summary.replaceAll(/\s+/g, ' ').replaceAll(/\s+,/g, ',')
    return formattedSummary
  }

  getIssueType(issue: Issue): string {
    if (issue.fields.issuetype && issue.fields.issuetype.name) {
      return issue.fields.issuetype.name
    }

    throw new Error(`Issue ${issue.key} has no issuetype`)
  }

  // TODO: Need to figure out handling for when not in a git repo, or on a branch does not match expected format
  public async getJiraIssueKeyFromArgsOrCurrentBranch(): Promise<string> {
    return new Promise((resolve) => {
      if (this.args.issueKey) {
        resolve(this.args.issueKey)
      } else {
        this.getJiraIssueKeyFromCurrentBranch().then((jiraIssueKey) => {
          resolve(jiraIssueKey)
        })
      }
    })
  }

  async getJiraIssueKeyFromCurrentBranch(): Promise<string> {
    const branchSummaryResult = await GitClient.branch()
    const { current } = branchSummaryResult
    const split = current.split('/')
    const jiraIssueKey = split[1].toUpperCase()

    return jiraIssueKey
  }

  // TODO: Sort by most recent created at date
  getJiraIssueLink(issueKey: string): string {
    return `${process.env.JIRA_API_HOSTNAME}/browse/${issueKey}`
  }

  // TODO: Limit to one result
  async getLatestPrForJiraIssue(jiraIssueIdOrKey: string): Promise<{ number: null | number, url: null | string }> {
    const response = await GHClient.rest.search.issuesAndPullRequests({
      q: `type:pr is:open ${jiraIssueIdOrKey} assignee:@me`,
    })

    const results = response.data.items
    const result = results.length > 0 ? results[0] : null

    if (result && result.pull_request?.html_url) {
      return {
        number: result.number,
        url: result.pull_request.html_url,
      }
    }

    throw new Error(`No open PRs found for ${jiraIssueIdOrKey} assigned to you`)
  }

  // TODO: Codesmell, this isn't just logging but copying to system clipboard, so might need to decouple this a bit
  public handleLogging(message: string) {
    if (this.flags.clipboard) {
      this.copyToClipboard(message)
      if (!this.flags.quiet) {
        this.log(`Copied to clipboard: ${message}`)
      }
    } else {
      this.log(message)
    }
  }

  public async init(): Promise<void> {
    await super.init()
    const { args, flags } = await this.parse({
      args: this.ctor.args,
      baseFlags: (super.ctor as typeof JgCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      flags: this.ctor.flags,
      strict: this.ctor.strict,
    })
    this.flags = flags as Flags<T>
    this.args = args as Args<T>
    this.validateFlags()
    this.jiraIssueKey = await this.getJiraIssueKeyFromArgsOrCurrentBranch()
  }

  public validateFlags() {
    if (this.flags.quiet && !this.flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }
  }
}
