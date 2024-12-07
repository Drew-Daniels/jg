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
    const { PREFIX, args, flags } = this

    let jiraIssueKey;

    if (args.issueIdOrKey) {
      if (new RegExp(`^${PREFIX}-\\d{5,}$`).test(args.issueIdOrKey)) {
        // Full Jira Issue Key specified, no changes necessary
        jiraIssueKey = args.issueIdOrKey
      } else if (/^\d{5,}$/.test(args.issueIdOrKey)) {
        // Only Jira Issue ID specified, add prefix
        jiraIssueKey = `${PREFIX}-${args.issueIdOrKey}`
      } else {
        this.error(`Invalid Jira Issue ID: ${args.issueIdOrKey}`)
      }
    } else {
      jiraIssueKey = await utils.getJiraIssueKeyFromCurrentBranch()
    }

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
