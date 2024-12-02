import { Args, Command, Flags } from '@oclif/core'

import utils from '../../utils/index.js'

// TODO: Rename this function so it doesn't share the same name as the C compiler, 'cc' command
export default class Cc extends Command {
  static override args = {
    issueIdOrKey: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Generates a Conventional Commit Message from a Jira Issue ID/Key'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    clipboard: Flags.boolean({ char: 'c', default: false, description: 'Copy to clipboard' }),
    help: Flags.help({ char: 'h', description: 'Show help' }),
    quiet: Flags.boolean({ char: 'q', description: 'Suppress output' }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Cc)

    if (flags.quiet && !flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }

    const issueKey = args.issueIdOrKey ?? (await utils.getJiraIssueKeyFromCurrentBranch());

    const issue = await utils.fetchIssue(issueKey)

    const issueType = utils.getIssueType(issue)
    const issueScopeAndSummary = utils.getIssueScopeAndSummary(issue)

    const lastScopeIndex = issueScopeAndSummary.lastIndexOf(':')
    const issueScope = issueScopeAndSummary.slice(0, Math.max(0, lastScopeIndex))
    const issueSummary = issueScopeAndSummary.slice(Math.max(0, lastScopeIndex + 1)).replaceAll(/^\s+/g, '')

    const message = `${issueType === 'Bug' ? 'fix' : 'feat'}(${issueScope}): ${issueSummary}`
    if (flags.clipboard) {
      utils.pbcopy(message)
      if (!flags.quiet) {
        this.log(`Copied Conventional Commit Message to clipboard: ${message}`)
      }
    } else {
      this.log(message)
    }
  }
}
