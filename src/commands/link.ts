import { Args, Command, Flags } from '@oclif/core'

export default class Link extends Command {
  static override args = {
    id: Args.string({ description: 'Jira Issue ID' }),
  }

  static override description = 'Copies Jira Issue Link'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    clipboard: Flags.boolean({ char: 'f', default: false, description: 'Copy to clipboard' }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Link)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /Users/drew.daniels/projects/jg/src/commands/link.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
