import { Args, Command, Flags } from '@oclif/core'

import utils from '../../utils/index.js'

export default class Bname extends Command {
  static override args = {
    issueIdOrKey: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Generates a Git branch name from a Jira Issue ID/Key'

  static override enableJsonFlag = true

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --clipboard',
    '<%= config.bin %> <%= command.id %> --clipboard --quiet',
    '<%= config.bin %> <%= command.id %> --json',
  ]

  static override flags = {
    clipboard: Flags.boolean({ char: 'c', default: false, description: 'Copy to clipboard' }),
    help: Flags.help({ char: 'h', description: 'Show help' }),
    quiet: Flags.boolean({ char: 'q', dependsOn: ['clipboard'], description: 'Suppress output' }),
  }

  public async run(): Promise<{ bname: string }> {
    const { args, flags } = await this.parse(Bname)

    if (flags.quiet && !flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }

    const issueKey = args.issueIdOrKey ?? (await utils.getJiraIssueKeyFromCurrentBranch());

    const { scopes, summary, type } = await utils.getExtractedIssueData(issueKey)

    const issueScope = scopes.join('-').toUpperCase()
    const issueSummary = summary
      .replaceAll('.', '')
      .replaceAll(/\s/g, '-')
      .toLowerCase()

    const message = `${type === 'Bug' ? 'fix' : 'feat'}/${issueKey}/${issueScope}-${issueSummary}`
    if (flags.clipboard) {
      utils.copyToClipboard(message)
      if (!flags.quiet) {
        this.log(`Copied Branch Name to clipboard: ${message}`)
      }
    } else {
      this.log(message)
    }

    return {
      bname: message,
    }
  }
}
