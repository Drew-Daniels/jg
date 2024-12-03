import { Args } from '@oclif/core'

import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Pr extends JgCommand<typeof Pr> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'file to read' }),
  }

  static override description = 'Generates a Slack Message with a Link to a Jira Issue and corresponding GitHub link'

  public async run(): Promise<{ message: string }> {
    const { args, flags } = await this.parse(Pr)

    if (flags.quiet && !flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }

    const issueKey = args.issueIdOrKey ?? (await utils.getJiraIssueKeyFromCurrentBranch());

    const jiraIssueLink = await utils.getJiraIssueLink(issueKey)
    const jiraIssueMarkdownLink = `[${issueKey}](${jiraIssueLink})`

    // TODO: Fix issue where a partial message is returned with Jira issue markdown link and empty Gh PR issue link (happens when there is a PR for a jira issue but it is now closed)
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
