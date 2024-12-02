import { Args, Command, Flags } from '@oclif/core'

export default class Pr extends Command {
  static override args = {
    file: Args.string({ description: 'file to read' }),
  }

  static override description = 'Generates a Slack Message with a Link to a Jira Issue and corresponding GitHub link'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f' }),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'name to print' }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Pr)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /Users/drew.daniels/projects/jg/src/commands/pr/index.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
