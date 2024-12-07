import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Id extends JgCommand<typeof Id> {
  static override description = 'Returns Jira Issue ID from current Git branch'

  public async run(): Promise<{ id: string }> {
    const jiraIssueKey = await utils.getJiraIssueKeyFromCurrentBranch()
    const jiraIssueId = jiraIssueKey.split('-')[1]

    this.handleLogging(jiraIssueId)

    return {
      id: jiraIssueId
    }
  }
}
