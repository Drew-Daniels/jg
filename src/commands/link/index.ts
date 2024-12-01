import { Args, Command, Flags } from '@oclif/core'

import utils from '../../utils/index.js'

export default class Link extends Command {
  static override args = {
    id: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Copies Jira Issue ID, Markdown Link, or Link to clipboard'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    clipboard: Flags.boolean({ char: 'c', default: false, description: 'Copy to clipboard' }),
    help: Flags.help({ char: 'h', description: 'Show help' }),
    markdown: Flags.boolean({ char: 'm', description: 'Get Markdown Link to Jira Issue' }),
    quiet: Flags.boolean({ char: 'q', description: 'Suppress output' }),
  }

  readonly PREFIX = 'EMR'

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Link)

    if (flags.quiet && !flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }

    let jiraIssueKey;

    if (args.id) {
      if (new RegExp(`^${this.PREFIX}-\\d{5,}$`).test(args.id)) {
        // Full Jira Issue Key specified, no changes necessary
        jiraIssueKey = args.id
      } else if (/^\d{5,}$/.test(args.id)) {
        // Only Jira Issue ID specified, add prefix
        jiraIssueKey = `${this.PREFIX}-${args.id}`
      } else {
        this.error(`Invalid Jira Issue ID: ${args.id}`)
      }
    } else {
      jiraIssueKey = await utils.getJiraIssueKeyFromCurrentBranch()
    }

    // links
    const jiraIssue = await utils.getJiraIssueLink(jiraIssueKey)
    if (flags.markdown) {
      const markdownLink = `[${jiraIssueKey}](${jiraIssue})`
      if (flags.clipboard) {
        utils.pbcopy(markdownLink)
        if (!flags.quiet) {
          this.log(`Copied Jira Issue Markdown Link to clipboard: ${markdownLink}`)
        }
      } else {
        this.log(`${markdownLink}`)
      }
    } else if (flags.clipboard) {
      utils.pbcopy(jiraIssue)
      if (!flags.quiet) {
        this.log(`Copied Jira Issue Link to clipboard: ${jiraIssue}`)
      }
    } else {
      this.log(`${jiraIssue}`)
    }
  }
}
