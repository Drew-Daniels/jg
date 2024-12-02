import { Args, Command, Flags } from '@oclif/core'
import clipboard from 'clipboardy'

import utils from '../../utils/index.js'

export default class Bname extends Command {
  static override args = {
    issueIdOrKey: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Generates a Git branch name from a Jira Issue ID/Key'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    clipboard: Flags.boolean({ char: 'c', default: false, description: 'Copy to clipboard' }),
    help: Flags.help({ char: 'h', description: 'Show help' }),
    quiet: Flags.boolean({ char: 'q', description: 'Suppress output' }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Bname)

    if (flags.quiet && !flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }

    // TODO: Dedupe with Cc
    const issueKey = args.issueIdOrKey ?? (await utils.getJiraIssueKeyFromCurrentBranch());

    const issue = await utils.fetchIssue(issueKey)

    const issueType = utils.getIssueType(issue)
    const issueScopeAndSummary = utils.getIssueScopeAndSummary(issue)

    const lastScopeIndex = issueScopeAndSummary.lastIndexOf(':')
    const issueScope = lastScopeIndex === -1 ? '' : `${issueScopeAndSummary.slice(0, Math.max(0, lastScopeIndex))}`
      .replaceAll(/\s+/g, '')
      .replaceAll(':', '-')
      .toUpperCase()
    const issueSummary = issueScopeAndSummary.slice(Math.max(0, lastScopeIndex + 1))
      .replaceAll(/^\s+/g, '')
      .replaceAll('.', '')
      .replaceAll(/\s/g, '-')
      .toLowerCase()

    const message = `${issueType === 'Bug' ? 'fix' : 'feat'}/${issueKey}/${issueScope}-${issueSummary}`
    if (flags.clipboard) {
      clipboard.writeSync(message)
      if (!flags.quiet) {
        this.log(`Copied Branch Name to clipboard: ${message}`)
      }
    } else {
      this.log(message)
    }
  }
}
