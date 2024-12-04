import { Args } from '@oclif/core'

import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Bname extends JgCommand<typeof Bname> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Generates a Git branch name from a Jira Issue ID/Key'

  public async run(): Promise<{ bname: string }> {
    const { args, flags } = this

    const issueKey = args.issueIdOrKey ?? (await utils.getJiraIssueKeyFromCurrentBranch());

    const { scopes, summary, type } = await utils.getExtractedIssueData(issueKey)

    const issueScope = scopes.join('-').toUpperCase()
    const issueSummary = summary
      .replaceAll('.', '')
      .replaceAll(/\s/g, '-')
      .toLowerCase()

    // TODO: Add support for just passing jira issue ID, not the entire key
    // TODO: Limit length
    const message = `${type === 'Bug' ? 'fix' : 'feat'}/${issueKey}/${issueScope}-${issueSummary}`
    if (flags.clipboard) {
      utils.copyToClipboard(message)
      if (!flags.quiet) {
        this.log(`Copied Branch Name to clipboard: ${message}`)
      }
    } else {
      this.log(message)
    }

    return {
      bname: message,
    }
  }
}
