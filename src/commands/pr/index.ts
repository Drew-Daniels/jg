import { Args, Command, Flags } from '@oclif/core'

import utils from '../../utils/index.js'

export default class Pr extends Command {
  static override args = {
    issueIdOrKey: Args.string({ description: 'file to read' }),
  }

  static override description = 'Generates a Slack Message with a Link to a Jira Issue and corresponding GitHub link'

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

  public async run(): Promise<{ message: string }> {
    const { args, flags } = await this.parse(Pr)

    if (flags.quiet && !flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }

    const issueKey = args.issueIdOrKey ?? (await utils.getJiraIssueKeyFromCurrentBranch());

    const jiraIssueLink = await utils.getJiraIssueLink(issueKey)
    const jiraIssueMarkdownLink = `[${issueKey}](${jiraIssueLink})`

    const [ghPrNumber, ghPrLink] = await utils.getLatestPrForJiraIssue(issueKey)
    const ghPrMarkdownLink = `[#${ghPrNumber}](${ghPrLink})`

    const slackMessage = `PR for ${jiraIssueMarkdownLink}: ${ghPrMarkdownLink}`

    if (flags.clipboard) {
      utils.copyToClipboard(slackMessage)
      if (!flags.quiet) {
        this.log('Copied Slack Message to clipboard:', slackMessage)
      }
    } else {
      this.log(slackMessage)
    }

    return {
      message: slackMessage
    }
  }
}
