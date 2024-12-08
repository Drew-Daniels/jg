import { Args } from '@oclif/core'
import { oraPromise } from 'ora'

import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Find extends JgCommand<typeof Find> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Finds the latest GH PR for a Jira ticket'

  async catch(error: Error) {
    this.log(error.message)
  }

  public async run(): Promise<{ link: null | string }> {
    const result = await oraPromise(utils.getLatestPrForJiraIssue(this.jiraIssueKey), { prefixText: 'Fetching PR' })
    const { url } = result

    if (url) {
      this.handleLogging(url)
    } else {
      this.log(`No PR found for ${this.jiraIssueKey} under your name`)
    }

    return {
      link: url,
    }
  }
}
