import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Key extends JgCommand<typeof Key> {
  static override description = 'Returns Jira Issue Key from current Git branch'

  public async run(): Promise<{ key: string }> {
    const { flags } = this

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
