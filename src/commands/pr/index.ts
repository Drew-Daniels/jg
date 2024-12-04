import { Args } from '@oclif/core'

import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Pr extends JgCommand<typeof Pr> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'file to read' }),
  }

  static override description = 'Generates a Slack Message with a Link to a Jira Issue and corresponding GitHub link'

  public async run(): Promise<{ message: string }> {
    const { args, flags } = this

    const issueKey = args.issueIdOrKey ?? (await utils.getJiraIssueKeyFromCurrentBranch());

    const jiraIssueLink = await utils.getJiraIssueLink(issueKey)
    const jiraIssueMarkdownLink = `[${issueKey}](${jiraIssueLink})`

    const [ghPrNumber, ghPrLink] = await utils.getLatestPrForJiraIssue(issueKey)
    const ghPrMarkdownLink = `[#${ghPrNumber}](${ghPrLink})`

    const slackMessage = `PR for ${jiraIssueMarkdownLink}: ${ghPrMarkdownLink}`

    if (flags.clipboard) {
      utils.copyToClipboard(slackMessage)
      if (!flags.quiet) {
        this.log('Copied Slack Message to clipboard:', slackMessage)
      }
    } else {
      this.log(slackMessage)
    }

    return {
      message: slackMessage
    }
  }
}
