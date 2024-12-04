import { Args } from '@oclif/core'

import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

// TODO: Rename this function so it doesn't share the same name as the C compiler, 'cc' command
export default class Cc extends JgCommand<typeof Cc> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Generates a Conventional Commit Message from a Jira Issue ID/Key'

  public async run(): Promise<{ message: string }> {
    const { args, flags } = this

    if (flags.quiet && !flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }

    const issueKey = args.issueIdOrKey ?? (await utils.getJiraIssueKeyFromCurrentBranch());

    const { scopes, summary, type } = await utils.getExtractedIssueData(issueKey)
    const issueScope = scopes.length > 0 ? `(${scopes.join(':')})` : ''

    const message = `${type === 'Bug' ? 'fix' : 'feat'}${issueScope}: ${summary}`
    if (flags.clipboard) {
      utils.copyToClipboard(message)
      if (!flags.quiet) {
        this.log(`Copied Conventional Commit Message to clipboard: ${message}`)
      }
    } else {
      this.log(message)
    }

    return {
      message
    }
  }
}
