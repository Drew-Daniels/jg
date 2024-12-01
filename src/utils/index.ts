import { spawn } from 'node:child_process'

export default {
  getJiraIssueKeyFromCurrentBranch,
  getJiraIssueLink,
  pbcopy,
  runShellCmd
}

function runShellCmd(cmd: string, args: string[] = []): Promise<string> {
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
function pbcopy(data: string) {
  const proc = spawn('pbcopy')
  proc.stdin.write(data)
  proc.stdin.end()
}

/**
 * @param identifier - Jira Issue ID or Key
 * @returns Jira Issue Link
 */
async function getJiraIssueLink(identifier: string): Promise<string> {
  const link = await runShellCmd(`jira open ${identifier} -n | tr -d '\n'`)
  return link
}

async function getJiraIssueKeyFromCurrentBranch(): Promise<string> {
  const jiraIssueKey = await runShellCmd('git branch --show-current | cut -d / -f2- | cut -d / -f1 | tr -d "[:space:]" | tr a-z A-Z')
  let jiraIssueId;
  // TODO: Check if Jira Issue Key includes prefix
  if (/^[A-Z]+-\d{5,}$/.test(jiraIssueKey)) {
    jiraIssueId = jiraIssueKey.split('-')[1]
  } else {
    throw new Error(`Not a Jira Issue Key: ${jiraIssueKey}`)
  }

  return jiraIssueId
}
