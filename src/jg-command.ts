import { Command, Flags, Interfaces } from '@oclif/core'
import clipboard from 'clipboardy'
// eslint-disable-next-line import/default
import pkg from 'fs-extra'
import { Issue } from "jira.js/out/version3/models/issue.js";
import path from 'node:path'


const { readJSON } = pkg

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

type UserConfig = {
  github: {
    organization: string
  }
  jira: {
    issuePrefix: string
  },
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
  protected userConfig!: UserConfig

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }

  // TODO: Figure out how to enable users to specify their org(s) to search for issues under using a configuration file:
  formatJiraIssueIdOrKey(jiraIssueIdOrKey: string) {
    if (/^\d{5,}$/.test(jiraIssueIdOrKey)) {
      // add prefix
      if (!this.userConfig.jira.issuePrefix && !process.env.JIRA_ISSUE_PREFIX) {
        this.log('No Jira prefix configured in user config - either add to config.json or set JIRA_ISSUE_PREFIX environment variable')
        this.exit(1)
      }

      jiraIssueIdOrKey = `${this.userConfig.jira.issuePrefix || process.env.JIRA_ISSUE_PREFIX}-${jiraIssueIdOrKey}`
    }

    if (!(new RegExp(`^${this.userConfig.jira.issuePrefix}-\\d{5,}$`).test(jiraIssueIdOrKey))) {
      this.log(`Jira Issue format incorrect: ${jiraIssueIdOrKey}, expected: ${this.userConfig.jira.issuePrefix}-<5 digits>`)
      this.exit(1)
    }

    return jiraIssueIdOrKey
  }


  // Add this to q: org:<org-name>
  async getExtractedIssueData(issueIdOrKey: string): Promise<ExtractedIssueData> {
    const issue = await this.fetchIssue(issueIdOrKey)
    const type = this.getIssueType(issue)
    const issueScopeAndSummary = this.getIssueScopeAndSummary(issue)
      .replaceAll('->', ':')

    const lastScopeIndex = issueScopeAndSummary.lastIndexOf(':')

    const scopesString = lastScopeIndex === -1 ? '' : `${issueScopeAndSummary.slice(0, Math.max(0, lastScopeIndex))}`
      .replaceAll(/\s+/g, ' ')
      .replaceAll(/\s*:\s*/g, ':')
      .replaceAll(/\s+$/g, '')

    const summary = issueScopeAndSummary.slice(Math.max(0, lastScopeIndex + 1))
      .replaceAll(/^\s+/g, '')
      .replaceAll(/\s+$/g, '')

    const scopes = scopesString.split(':').filter(Boolean)

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
  public async getJiraIssueFromArgsOrCurrentBranch(): Promise<string> {
    return new Promise((resolve) => {
      if (this.args.issueIdOrKey) {
        resolve(this.args.issueIdOrKey)
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
    const jiraIssueIdOrKey = split[1].toUpperCase()

    return this.formatJiraIssueIdOrKey(jiraIssueIdOrKey)
  }

  getJiraIssueLink(issueKey: string): string {
    return `${process.env.JIRA_API_HOSTNAME}/browse/${issueKey}`
  }

  // TODO: Limit this to one result
  async getLatestPrForJiraIssue(jiraIssueIdOrKey: string): Promise<{ number: null | number, url: null | string }> {
    const response = await GHClient.rest.search.issuesAndPullRequests({
      q: `type:pr is:open ${jiraIssueIdOrKey} in:title assignee:@me`,
    })

    const results = response.data.items
    const result = results.length > 0 ? results[0] : null

    if (result && result.pull_request?.html_url) {
      return {
        number: result.number,
        url: result.pull_request.html_url,
      }
    }

    throw new Error(`No PR found for ${jiraIssueIdOrKey} under your name`)
  }

  public async getUserConfig() {
    return readJSON(path.join(this.config.configDir, 'config.json'))
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
    this.userConfig = await this.getUserConfig()
    this.jiraIssueKey = this.formatJiraIssueIdOrKey(await this.getJiraIssueFromArgsOrCurrentBranch())
  }

  public validateFlags() {
    if (this.flags.quiet && !this.flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }
  }
}
