import { Args } from '@oclif/core'

import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Pr extends JgCommand<typeof Pr> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'file to read' }),
  }

  static override description = 'Generates a Slack Message with a Link to a Jira Issue and corresponding GitHub link'

  public async run(): Promise<{ message: string }> {
    const jiraIssueLink = utils.getJiraIssueLink(this.jiraIssueKey)
    const jiraIssueMarkdownLink = `[${this.jiraIssueKey}](${jiraIssueLink})`

    const { number, url } = await utils.getLatestPrForJiraIssue(this.jiraIssueKey)
    const ghPrMarkdownLink = `[#${number}](${url})`

    const slackMessage = `PR for ${jiraIssueMarkdownLink}: ${ghPrMarkdownLink}`

    this.handleLogging(slackMessage)

    return {
      message: slackMessage
    }
  }
}
