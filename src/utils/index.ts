import clipboard from 'clipboardy'
import { Issue } from "jira.js/out/version3/models/issue.js";

import { GHClient } from "../gh-client/index.js";
import { GitClient } from '../git-client/index.js';
import { JiraClient } from "../jira-client/index.js";

export default {
  copyToClipboard,
  getExtractedIssueData,
  getJiraIssueKeyFromCurrentBranch,
  getJiraIssueLink,
  getLatestPrForJiraIssue,
}

function getJiraIssueLink(issueKey: string): string {
  return `${process.env.JIRA_API_HOSTNAME}/browse/${issueKey}`
}

async function getJiraIssueKeyFromCurrentBranch(): Promise<string> {
  const branchSummaryResult = await GitClient.branch()
  const { current } = branchSummaryResult
  const split = current.split('/')
  const jiraIssueKey = split[1]
  const formattedJiraIssueKey = jiraIssueKey
    .toUpperCase()
  // TODO: Check if Jira Issue Key includes prefix
  if (!(/^[A-Z]+-\d{5,}$/.test(formattedJiraIssueKey))) {
    throw new Error(`Not a Jira Issue Key: ${jiraIssueKey}`)
  }

  return formattedJiraIssueKey
}

// TODO: Figure out how to enable users to specify their org(s) to search for issues under using a configuration file:
// Add this to q: org:<org-name>
async function getLatestPrForJiraIssue(jiraIssueIdOrKey: string): Promise<{ number: number, url: string }> {
  const issues = await GHClient.rest.search.issuesAndPullRequests({
    q: `type:pr is:open ${jiraIssueIdOrKey} in:title assignee:@me`,
  })
  if (issues.data.total_count === 0) {
    throw new Error(`No Open PR found for ${jiraIssueIdOrKey} under your name`)
  }

  const { number, url } = issues.data.items[0]

  return { number, url }
}

async function fetchIssue(issueIdOrKey: string): Promise<Issue> {
  const issue = await JiraClient.issues.getIssue({ issueIdOrKey })
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

function copyToClipboard(data: string) {
  clipboard.writeSync(data)
}

type ExtractedIssueData = {
  scopes: string[]
  summary: string
  type: string
}

async function getExtractedIssueData(issueIdOrKey: string): Promise<ExtractedIssueData> {
  const issue = await fetchIssue(issueIdOrKey)
  const type = getIssueType(issue)
  const issueScopeAndSummary = getIssueScopeAndSummary(issue)
  const lastScopeIndex = issueScopeAndSummary.lastIndexOf(':')
  const scopesString = lastScopeIndex === -1 ? '' : `${issueScopeAndSummary.slice(0, Math.max(0, lastScopeIndex))}`
    .replaceAll(/\s+/g, '')
  const summary = issueScopeAndSummary.slice(Math.max(0, lastScopeIndex + 1))
    .replaceAll(/^\s+/g, '')
  const scopes = scopesString.split(':').filter(Boolean)

  return {
    scopes,
    summary,
    type,
  }
}

