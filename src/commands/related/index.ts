import { Args } from '@oclif/core'

import { JgCommand } from '../../jg-command.js'

// TODO: Fix flags - similar issue to 'revisit' command
export default class Related extends JgCommand<typeof Related> {
  static override args = {
    issueKey: Args.string({ description: 'Jira Issue Key' }),
  }

  static override description = 'Opens all related PRs for a given Jira Issue'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<{ related: string[] }> {
    const related = await this.fetchRelatedIssues(this.jiraIssueKey)

    this.log(related.join('\n'))

    return {
      related
    }
  }
}
