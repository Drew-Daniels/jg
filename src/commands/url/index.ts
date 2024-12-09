import { Args, Flags } from '@oclif/core'

import { JgCommand } from '../../jg-command.js'

export default class Url extends JgCommand<typeof Url> {
  static override args = {
    issueKey: Args.string({ description: 'Jira Issue Key' }),
  }

  static override description = 'Returns a URL to a Jira Issue'

  static override flags = {
    markdown: Flags.boolean({ char: 'm', description: 'Get Markdown Link to Jira Issue' }),
  }

  public async run(): Promise<{ url: string }> {
    const { flags, jiraIssueKey } = this

    // links
    const jiraIssue = this.getJiraIssueLink(jiraIssueKey)
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
