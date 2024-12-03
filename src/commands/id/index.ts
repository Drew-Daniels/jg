import { Command, Flags } from '@oclif/core'

import utils from '../../utils/index.js'

export default class Id extends Command {
  static override description = 'Returns Jira Issue ID from current Git branch'

  public static enableJsonFlag = true

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    clipboard: Flags.boolean({ char: 'c', default: false, description: 'Copy to clipboard' }),
    help: Flags.help({ char: 'h', description: 'Show help' }),
    quiet: Flags.boolean({ char: 'q', description: 'Suppress output' }),
  }

  public async run(): Promise<{ id: string }> {
    const { flags } = await this.parse(Id)

    if (flags.quiet && !flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }

    const jiraIssueKey = await utils.getJiraIssueKeyFromCurrentBranch()
    const jiraIssueId = jiraIssueKey.split('-')[1]

    if (flags.clipboard) {
      utils.copyToClipboard(jiraIssueId)
      if (!flags.quiet) {
        this.log(`Copied Jira Issue ID to clipboard: ${jiraIssueId}`)
      }
    } else {
      this.log(jiraIssueId)
    }

    return {
      id: jiraIssueId
    }
  }
}
