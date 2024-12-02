import { Version3Client } from "jira.js";
import { Issue } from "jira.js/out/version3/models/issue.js";
import { spawn } from 'node:child_process'

if (!process.env.JIRA_API_TOKEN) {
  throw new Error('Missing JIRA_API_TOKEN')
}

if (!process.env.JIRA_API_HOSTNAME) {
  throw new Error('Missing JIRA_API_HOSTNAME')
}

if (!process.env.JIRA_API_EMAIL) {
  throw new Error('Missing JIRA_API_EMAIL')
}

const client = new Version3Client({
  authentication: {
    basic: {
      apiToken: process.env.JIRA_API_TOKEN,
      email: process.env.JIRA_API_EMAIL
    }
  },
  host: process.env.JIRA_API_HOSTNAME
});

export default {
  fetchIssue,
  getIssueScopeAndSummary,
  getIssueType,
  getJiraIssueKeyFromCurrentBranch,
  getJiraIssueLink,
  getLatestPrForJiraIssue,
  getNumIssueScopes,
  pbcopy,
  runShellCmd
}

function runShellCmd(cmd: string, args: string[] = []): Promise<Record<string, unknown> | string> {
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
  const link = await runShellCmd(`jira open ${identifier} -n | tr -d '\n'`) as string
  return link
}

async function getJiraIssueKeyFromCurrentBranch(): Promise<string> {
  const jiraIssueKey = await runShellCmd('git branch --show-current | cut -d / -f2- | cut -d / -f1 | tr -d "[:space:]" | tr a-z A-Z') as string
  let jiraIssueId;
  // TODO: Check if Jira Issue Key includes prefix
  if (/^[A-Z]+-\d{5,}$/.test(jiraIssueKey)) {
    jiraIssueId = jiraIssueKey.split('-')[1]
  } else {
    throw new Error(`Not a Jira Issue Key: ${jiraIssueKey}`)
  }

  return jiraIssueId
}

async function getLatestPrForJiraIssue(jiraIssueId: string): Promise<string> {
  const pr = await runShellCmd(`gh search prs ${jiraIssueId} --assignee="@me" --json=number,title,url --match=title --limit=1 | jq -r '.[0] | [.number, .url] | join(" ")'`) as string
  return pr
}

async function fetchIssue(issueIdOrKey: string): Promise<Issue> {
  const issue = await client.issues.getIssue({ issueIdOrKey })
  return issue
}

function getIssueType(issue: Issue): string {
  if (issue.fields.issuetype && issue.fields.issuetype.name) {
    return issue.fields.issuetype.name
  }

  throw new Error(`Issue ${issue.key} has no issuetype`)
}

function getIssueScopeAndSummary(issue: Issue): string {
  const { summary } = issue.fields
  const formattedSummary = summary.replaceAll(/\s+/g, ' ').replaceAll(/\s+,/g, ',')
  return formattedSummary
}

function getNumIssueScopes(issueSummary: Issue['fields']['summary']): number {
  return (issueSummary.match(/:/g) || []).length
}

