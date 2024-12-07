import { Args } from '@oclif/core'
import { oraPromise } from 'ora'

import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Find extends JgCommand<typeof Find> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Finds the latest GH PR for a Jira ticket'

  public async run(): Promise<{ link: string }> {
    const { url } = await oraPromise(utils.getLatestPrForJiraIssue(this.jiraIssueKey), { prefixText: 'Fetching PR' })

    this.handleLogging(url)

    return {
      link: url,
    }
  }
}
