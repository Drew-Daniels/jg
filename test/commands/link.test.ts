import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../src/utils/index.js'

describe('link', () => {
  it('runs link cmd', async () => {
    const fakeUtils = {
      async getJiraIssueKeyFromCurrentBranch() {
        return 'EMR-11111';
      },
      async getJiraIssueLink() {
        return 'https://jira.atlassian.com/browse/EMR-11111';
      },
      pbcopy() { }
    }
    sinon.replace(utils, 'getJiraIssueKeyFromCurrentBranch', fakeUtils.getJiraIssueKeyFromCurrentBranch)
    sinon.replace(utils, 'getJiraIssueLink', fakeUtils.getJiraIssueLink)
    sinon.replace(utils, 'pbcopy', fakeUtils.pbcopy)

    const { stdout } = await runCommand('link')
    expect(stdout).to.contain('https://jira.atlassian.com/browse/EMR-11111')
  })
})
