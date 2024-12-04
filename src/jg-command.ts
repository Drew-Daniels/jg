import { Command, Flags, Interfaces } from '@oclif/core'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<T['flags'] & typeof JgCommand['baseFlags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class JgCommand<T extends typeof Command> extends Command {
  static baseFlags = {
    clipboard: Flags.boolean({ char: 'c', default: false, description: 'Copy to clipboard' }),
    help: Flags.help({ char: 'h', description: 'Show help' }),
    quiet: Flags.boolean({ char: 'q', dependsOn: ['clipboard'], description: 'Suppress output' }),
  }

  static enableJsonFlag = true

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --clipboard',
    '<%= config.bin %> <%= command.id %> --clipboard --quiet',
    '<%= config.bin %> <%= command.id %> --json',
  ]

  protected args!: Args<T>
  protected flags!: Flags<T>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async catch(err: { exitCode?: number } & Error): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }

  public async init(): Promise<void> {
    await super.init()
    const { args, flags } = await this.parse({
      args: this.ctor.args,
      baseFlags: (super.ctor as typeof JgCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      flags: this.ctor.flags,
      strict: this.ctor.strict,
    })
    this.flags = flags as Flags<T>
    this.args = args as Args<T>
    this.validateFlags()
  }

  public validateFlags() {
    if (this.flags.quiet && !this.flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }
  }
}
