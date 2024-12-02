import { Version3Client } from "jira.js";

if (!process.env.JIRA_API_HOSTNAME) {
  throw new Error('Missing JIRA_API_HOSTNAME')
}

if (!process.env.JIRA_API_EMAIL) {
  throw new Error('Missing JIRA_API_EMAIL')
}

if (!process.env.JIRA_API_TOKEN) {
  throw new Error('Missing JIRA_API_TOKEN')
}

const JiraClient = new Version3Client({
  authentication: {
    basic: {
      apiToken: process.env.JIRA_API_TOKEN,
      email: process.env.JIRA_API_EMAIL
    }
  },
  host: process.env.JIRA_API_HOSTNAME
});

export {
  JiraClient,
}
