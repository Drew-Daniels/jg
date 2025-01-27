import { Args } from '@oclif/core'

import { JgCommand } from '../../jg-command.js'

export default class Changed extends JgCommand<typeof Changed> {
  static override args = {
    issueKey: Args.string({ description: 'Jira Issue Key' }),
  }

  static override description = 'Lists changed files for a given Jira Issue'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<{ changed: string[] }> {
    const changed = await this.fetchChangedFiles(this.jiraIssueKey)

    this.handleLogging(changed.join('\n'))

    return {
      changed
    }
  }
}
