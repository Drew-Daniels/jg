import { JgCommand } from '../../jg-command.js'

export default class Id extends JgCommand<typeof Id> {
  static override description = 'Returns Jira Issue ID from current Git branch'

  public async run(): Promise<{ id: string }> {
    const jiraIssueId = this.jiraIssueKey.split('-')[1]

    this.handleLogging(jiraIssueId)

    return {
      id: jiraIssueId
    }
  }
}
