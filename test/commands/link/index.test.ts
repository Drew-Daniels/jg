import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('link', () => {
  beforeEach(() => {
    sinon.stub(utils, 'getJiraIssueKeyFromCurrentBranch').resolves('EMR-11111')
    sinon.stub(utils, 'getJiraIssueLink').resolves('https://jira.atlassian.com/browse/EMR-11111')
    sinon.stub(utils, 'pbcopy')
  })
  afterEach(() => {
    sinon.restore()
  })

  it('runs link cmd', async () => {
    const { stdout } = await runCommand('link')
    expect(stdout).to.equal('https://jira.atlassian.com/browse/EMR-11111\n')
  })
})
