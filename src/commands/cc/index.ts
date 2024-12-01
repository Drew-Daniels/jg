import { Args, Command, Flags } from '@oclif/core'

export default class Cc extends Command {
  static override args = {
    file: Args.string({ description: 'file to read' }),
  }

  static override description = 'describe the command here'

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
    const { args, flags } = await this.parse(Cc)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /Users/drew.daniels/projects/jg/src/commands/cc/index.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
