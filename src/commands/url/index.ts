import { Args, Flags } from '@oclif/core'

import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Url extends JgCommand<typeof Url> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Returns a URL to a Jira Issue'

  static override flags = {
    markdown: Flags.boolean({ char: 'm', description: 'Get Markdown Link to Jira Issue' }),
  }

  readonly PREFIX = 'EMR'

  public async run(): Promise<{ url: string }> {
    const { flags, jiraIssueKey } = this

    // links
    const jiraIssue = utils.getJiraIssueLink(jiraIssueKey)
    if (flags.markdown) {
      const markdownLink = `[${jiraIssueKey}](${jiraIssue})`

      this.handleLogging(markdownLink)

      return {
        url: markdownLink
      }
    }

    this.handleLogging(jiraIssue)

    return {
      url: jiraIssue
    }
  }
}
