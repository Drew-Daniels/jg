import { Args } from '@oclif/core'

import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Pr extends JgCommand<typeof Pr> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'file to read' }),
  }

  static override description = 'Generates a Slack Message with a Link to a Jira Issue and corresponding GitHub link'

  public async run(): Promise<{ message: string }> {
    const { args } = this

    const issueKey = args.issueIdOrKey ?? (await utils.getJiraIssueKeyFromCurrentBranch());

    const jiraIssueLink = utils.getJiraIssueLink(issueKey)
    const jiraIssueMarkdownLink = `[${issueKey}](${jiraIssueLink})`

    const { number, url } = await utils.getLatestPrForJiraIssue(issueKey)
    const ghPrMarkdownLink = `[#${number}](${url})`

    const slackMessage = `PR for ${jiraIssueMarkdownLink}: ${ghPrMarkdownLink}`

    this.handleLogging(slackMessage)

    return {
      message: slackMessage
    }
  }
}
