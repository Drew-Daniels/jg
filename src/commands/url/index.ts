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
    const { args, flags } = await this.parse(Url)

    if (flags.quiet && !flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }

    let jiraIssueKey;

    if (args.issueIdOrKey) {
      if (new RegExp(`^${this.PREFIX}-\\d{5,}$`).test(args.issueIdOrKey)) {
        // Full Jira Issue Key specified, no changes necessary
        jiraIssueKey = args.issueIdOrKey
      } else if (/^\d{5,}$/.test(args.issueIdOrKey)) {
        // Only Jira Issue ID specified, add prefix
        jiraIssueKey = `${this.PREFIX}-${args.issueIdOrKey}`
      } else {
        this.error(`Invalid Jira Issue ID: ${args.issueIdOrKey}`)
      }
    } else {
      jiraIssueKey = await utils.getJiraIssueKeyFromCurrentBranch()
    }

    // links
    const jiraIssue = await utils.getJiraIssueLink(jiraIssueKey)
    if (flags.markdown) {
      const markdownLink = `[${jiraIssueKey}](${jiraIssue})`
      if (flags.clipboard) {
        utils.copyToClipboard(markdownLink)
        if (!flags.quiet) {
          this.log(`Copied Jira Issue Markdown Link to clipboard: ${markdownLink}`)
        }
      } else {
        this.log(`${markdownLink}`)
      }

      return {
        url: markdownLink
      }
    }

    if (flags.clipboard) {
      utils.copyToClipboard(jiraIssue)
      if (!flags.quiet) {
        this.log(`Copied Jira Issue URL to clipboard: ${jiraIssue}`)
      }
    } else {
      this.log(`${jiraIssue}`)
    }

    return {
      url: jiraIssue
    }
  }
}
