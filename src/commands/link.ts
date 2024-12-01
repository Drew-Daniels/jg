import { Args, Command, Flags } from '@oclif/core'

import { runCommand } from '../utils/index.js'

export default class Link extends Command {
  static override args = {
    id: Args.string({ description: 'Jira Issue ID' }),
  }

  static override description = 'Copies Jira Issue Link'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    clipboard: Flags.boolean({ char: 'c', default: false, description: 'Copy to clipboard' }),
    help: Flags.help({ char: 'h' }),
    quiet: Flags.boolean({ char: 'q', description: 'Suppress output' }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Link)

    const branch = await runCommand('git branch', ['--show-current']) as string;
    console.log('branch:', branch)
  }
}
