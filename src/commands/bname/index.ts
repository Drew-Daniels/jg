import { Args } from '@oclif/core'
import { oraPromise } from 'ora'

import { JgCommand } from '../../jg-command.js'

export default class Bname extends JgCommand<typeof Bname> {
  static override args = {
    issueKey: Args.string({ description: 'Jira Issue Key' }),
  }

  static override description = 'Generates a Git branch name from a Jira Issue Key'

  public async run(): Promise<{ bname: string }> {
    const { scopes, summary, type } = await oraPromise(this.getExtractedIssueData(this.jiraIssueKey), { text: 'Fetching Jira Issue...' })

    let issueScope = ''
    if (scopes.length > 0) {
      issueScope = scopes
        .join('-')
        .toUpperCase()
        .replaceAll(/\s+/g, '-')
        .replaceAll("'", '')
        .replaceAll('"', '')
      issueScope += '-'
    }

    const issueSummary = summary
      .replaceAll('/', ' ')
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll('.', '')
      .replaceAll(',', '')
      .replaceAll("'", '')
      .replaceAll('"', '')
      .replaceAll('!', '')
      .replaceAll('?', '')
      .replaceAll(';', '')
      .replaceAll(/\s*>\s*/g, '-')
      .replaceAll(/\s/g, '-')
      .toLowerCase()

    // TODO: Add support for just passing jira issue ID, not the entire key
    let branchName = `${type === 'Bug' ? 'fix' : 'feat'}/${this.jiraIssueKey}/${issueScope}${issueSummary}`
    branchName = branchName.slice(0, 110)
    this.handleLogging(branchName)

    return {
      bname: branchName,
    }
  }
}
