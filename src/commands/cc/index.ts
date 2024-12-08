import { Args } from '@oclif/core'
import { oraPromise } from 'ora'

import { JgCommand } from '../../jg-command.js'

// TODO: Rename this function so it doesn't share the same name as the C compiler, 'cc' command
export default class Cc extends JgCommand<typeof Cc> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Generates a Conventional Commit Message from a Jira Issue ID/Key'

  public async run(): Promise<{ message: string }> {
    const { scopes, summary, type } = await oraPromise(this.getExtractedIssueData(this.jiraIssueKey), { prefixText: "Fetching Jira Issue..." })
    const issueScope = scopes.length > 0 ? `(${scopes.join(':')})` : ''

    const message = `${type === 'Bug' ? 'fix' : 'feat'}${issueScope}: ${summary}`
    this.handleLogging(message)

    return {
      message
    }
  }
}
