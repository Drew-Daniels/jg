import { Command, Flags } from '@oclif/core'

import utils from '../../utils/index.js'

export default class Key extends Command {
  static override description = 'Returns Jira Issue Key from current Git branch'

  static enableJsonFlag = true

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    clipboard: Flags.boolean({ char: 'c', default: false, description: 'Copy to clipboard' }),
    help: Flags.help({ char: 'h', description: 'Show help' }),
    quiet: Flags.boolean({ char: 'q', description: 'Suppress output' }),
  }

  public async run(): Promise<{ key: string }> {
    const { flags } = await this.parse(Key)

    if (flags.quiet && !flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }

    const jiraIssueKey = await utils.getJiraIssueKeyFromCurrentBranch()

    if (flags.clipboard) {
      utils.copyToClipboard(jiraIssueKey)
      if (!flags.quiet) {
        this.log(`Copied Jira Issue Key to clipboard: ${jiraIssueKey}`)
      }
    } else {
      this.log(jiraIssueKey)
    }

    return { key: jiraIssueKey }
  }
}
