import { JgCommand } from '../../jg-command.js'

export default class Key extends JgCommand<typeof Key> {
  static override description = 'Returns Jira Issue Key from current Git branch'

  public async run(): Promise<{ key: string }> {
    this.handleLogging(this.jiraIssueKey)

    return { key: this.jiraIssueKey }
  }
}
