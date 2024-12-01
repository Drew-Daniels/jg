import { Command, Flags } from '@oclif/core'

import utils from '../../utils/index.js'

const { getJiraIssueKeyFromCurrentBranch, pbcopy } = utils

export default class Id extends Command {
  static override description = 'Returns Jira Issue ID from current Git branch'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    clipboard: Flags.boolean({ char: 'c', default: false, description: 'Copy to clipboard' }),
    help: Flags.help({ char: 'h', description: 'Show help' }),
    quiet: Flags.boolean({ char: 'q', description: 'Suppress output' }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Id)

    const jiraIssueKey = await getJiraIssueKeyFromCurrentBranch()
    const jiraIssueId = jiraIssueKey.split('-')[1]

    if (flags.quiet && !flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }

    if (flags.clipboard) {
      pbcopy(jiraIssueId)
      if (!flags.quiet) {
        this.log(`Copied Jira Issue Key to clipboard: ${jiraIssueId}`)
      }
    } else {
      this.log(jiraIssueId)
    }
  }
}
