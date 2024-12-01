import { Args, Command, Flags } from '@oclif/core'

import { runCommand } from '../utils/index.js'

export default class Link extends Command {
  static override args = {
    id: Args.string({ description: 'Jira Issue ID or Key' }),
  }

  static override description = 'Copies Jira Issue ID, Markdown Link, or Link to clipboard'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    clipboard: Flags.boolean({ char: 'c', default: false, description: 'Copy to clipboard' }),
    help: Flags.help({ char: 'h', description: 'Show help' }),
    id: Flags.boolean({ char: 'i', description: 'Jira Issue ID' }),
    markdown: Flags.boolean({ char: 'm', description: 'Get Markdown Link to Jira Issue' }),
    quiet: Flags.boolean({ char: 'q', description: 'Suppress output' }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Link)

    let jiraIssueKey;

    if (args.id) {
      // TODO: Allow for customization of this logic
      if (/^EMR-\d{5,}$/.test(args.id)) {
        jiraIssueKey = args.id
      } else {
        this.error(`Invalid Jira Issue ID: ${args.id}`)
      }
    } else {
      jiraIssueKey = await runCommand("git branch --show-current | cut -d / -f2- | cut -d / -f1 | tr -d '[:space:]' | tr a-z A-Z");
    }

    // TODO: Refactor logging to use shared strings
    if (flags.id) {
      if (flags.clipboard) {
        await runCommand(`echo -n ${jiraIssueKey} | pbcopy`)
        if (!flags.quiet) {
          this.log(`Copied Jira Issue Key to clipboard: ${jiraIssueKey}`)
        }
      } else {
        this.log(jiraIssueKey)
      }
    } else if (flags.markdown) {
      const markdownLink = `[${jiraIssueKey}](https://jira.atlassian.com/browse/${jiraIssueKey})`
      if (flags.clipboard) {
        await runCommand(`echo -n "${markdownLink}" | pbcopy`)
        if (!flags.quiet) {
          this.log(`Copied Jira Issue Markdown Link to clipboard: ${markdownLink}`)
        }
      } else {
        this.log(`${markdownLink}`)
      }
    } else {
      const link = `https://jira.atlassian.com/browse/${jiraIssueKey}`
      if (flags.clipboard) {
        await runCommand(`echo -n "${link}" | pbcopy`)
        if (!flags.quiet) {
          this.log(`Copied Jira Issue Link to clipboard: ${link}`)
        }
      } else {
        this.log(`${link}`)
      }
    }
  }
}
