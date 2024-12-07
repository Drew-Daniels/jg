import { Command, Flags, Interfaces } from '@oclif/core'
// eslint-disable-next-line import/default
import pkg from 'fs-extra'
import path from 'node:path'
import { oraPromise } from 'ora'

const { readJSON } = pkg

import utils from './utils/index.js'

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
  protected jiraIssueKey!: string
  protected userConfig!: Record<string, unknown>

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

  // TODO: Need to figure out handling for when not in a git repo, or on a branch does not match expected format
  public async getJiraIssueFromArgsOrCurrentBranch(): Promise<string> {
    return new Promise((resolve) => {
      if (this.args.issueIdOrKey) {
        resolve(this.args.issueIdOrKey)
      } else {
        utils.getJiraIssueKeyFromCurrentBranch().then((jiraIssueKey) => {
          resolve(jiraIssueKey)
        })
      }
    })
  }

  public async getUserConfig() {
    return readJSON(path.join(this.config.configDir, 'config.json'))
  }

  // TODO: Codesmell, this isn't just logging but copying to system clipboard, so might need to decouple this a bit
  public handleLogging(message: string) {
    if (this.flags.clipboard) {
      utils.copyToClipboard(message)
      if (!this.flags.quiet) {
        this.log(`Copied to clipboard: ${message}`)
      }
    } else {
      this.log(message)
    }
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
    this.userConfig = await this.getUserConfig()
    this.jiraIssueKey = await oraPromise(this.getJiraIssueFromArgsOrCurrentBranch(), { prefixText: 'Fetching Jira Issue' })
  }

  public validateFlags() {
    if (this.flags.quiet && !this.flags.clipboard) {
      this.error('Cannot use --quiet without --clipboard')
    }
  }
}
