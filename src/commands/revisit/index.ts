import { Args } from '@oclif/core'
import open from 'open'

import { JgCommand } from '../../jg-command.js'

export default class Revisit extends JgCommand<typeof Revisit> {
  static override args = {
    issueKey: Args.string({ description: 'Jira Issue Key' }),
  }

  static override description = 'Opens all related PRs for a given Jira Issue'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    const related = await this.fetchRelatedIssues(this.jiraIssueKey)

    for (const pr of related) {
      open(pr)
    }
  }
}
