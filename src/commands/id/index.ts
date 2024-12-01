import { Command, Flags } from '@oclif/core'

import { getJiraIssueKeyFromCurrentBranch, pbcopy } from '../../utils/index.js'

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
    if (flags.clipboard) {
      pbcopy(jiraIssueKey)
      if (!flags.quiet) {
        this.log(`Copied Jira Issue Key to clipboard: ${jiraIssueKey}`)
      }
    } else {
      this.log(jiraIssueKey)
    }
  }
}
