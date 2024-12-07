import { Args } from '@oclif/core'

import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Find extends JgCommand<typeof Find> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Finds the latest GH PR for a Jira ticket'

  public async run(): Promise<{ link: string }> {
    const { args, flags } = this

    const issueKey = args.issueIdOrKey ?? (await utils.getJiraIssueKeyFromCurrentBranch());

    const [, ghPrLink] = await utils.getLatestPrForJiraIssue(issueKey)

    if (flags.clipboard) {
      utils.copyToClipboard(ghPrLink)
      if (!flags.quiet) {
        this.log(`Copied GitHub PR link to clipboard: ${ghPrLink}`)
      }
    } else {
      this.log(ghPrLink)
    }

    return {
      link: ghPrLink,
    }
  }
}
