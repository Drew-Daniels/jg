import { Args } from '@oclif/core'
import { oraPromise } from 'ora'

import { JgCommand } from '../../jg-command.js'
import utils from '../../utils/index.js'

export default class Bname extends JgCommand<typeof Bname> {
  static override args = {
    issueIdOrKey: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Generates a Git branch name from a Jira Issue ID/Key'

  public async run(): Promise<{ bname: string }> {
    const { scopes, summary, type } = await oraPromise(utils.getExtractedIssueData(this.jiraIssueKey), { text: 'Fetching Jira Issue...' })

    const issueScope = scopes.length > 0 ? `${scopes.join('-').toUpperCase()}-` : ''

    const issueSummary = summary
      .replaceAll('/', ' ')
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll('.', '')
      .replaceAll(/\s/g, '-')
      .toLowerCase()

    // TODO: Add support for just passing jira issue ID, not the entire key
    // TODO: Limit length
    const message = `${type === 'Bug' ? 'fix' : 'feat'}/${this.jiraIssueKey}/${issueScope}${issueSummary}`
    this.handleLogging(message)

    return {
      bname: message,
    }
  }
}
