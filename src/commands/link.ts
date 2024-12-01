import { Args, Command, Flags } from '@oclif/core'
import { spawn } from 'node:child_process'

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

    const cmd = spawn('git branch --show-current', { shell: true, stdio: 'inherit' })

    cmd.stdout?.on('data', (data: unknown) => {
      console.log(data?.toString())
    })
  }
}
