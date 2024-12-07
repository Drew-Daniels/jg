import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Key extends JgCommand<typeof Key> {
  static override description = 'Returns Jira Issue Key from current Git branch'

  public async run(): Promise<{ key: string }> {
    const jiraIssueKey = await utils.getJiraIssueKeyFromCurrentBranch()

    this.handleLogging(jiraIssueKey)

    return { key: jiraIssueKey }
  }
}
