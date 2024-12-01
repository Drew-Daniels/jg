import { spawn } from 'node:child_process'

export function runCommand(cmd: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { shell: true, stdio: 'pipe' })

    child.stdout.on('data', (data) => {
      resolve(Buffer.from(data, 'utf8').toString())
    })

    child.on('close', (code) => {
      resolve(`Command exited with code ${code}`)
    })

    child.stderr.on('data', (data) => {
      reject(Buffer.from(data, 'utf8').toString())
    })
  })
}

// https://stackoverflow.com/a/13735363/13175926
export function pbcopy(data: string) {
  const proc = spawn('pbcopy')
  proc.stdin.write(data)
  proc.stdin.end()
}

/**
 * @param identifier - Jira Issue ID or Key
 * @returns Jira Issue Link
 */
export async function getJiraIssueLink(identifier: string): Promise<string> {
  const link = await runCommand(`jira open ${identifier} -n | tr -d '\n'`)
  return link
}

export function getJiraIssueKeyFromCurrentBranch(): Promise<string> {
  return runCommand('git branch --show-current | cut -d / -f2- | cut -d / -f1 | tr -d "[:space:]" | tr a-z A-Z')
}
