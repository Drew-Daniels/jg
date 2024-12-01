import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('id', () => {
  beforeEach(() => {
    sinon.stub(utils, 'getJiraIssueKeyFromCurrentBranch').resolves('EMR-54321')
    sinon.stub(utils, 'pbcopy')
  })

  it('just prints Jira Issue ID when no options are passed', async () => {
    const { stdout } = await runCommand('id')
    expect(stdout).to.equal('54321\n')
  })
  it('copies Jira Issue ID to clipboard when --clipboard is passed', async () => {
    const { stdout } = await runCommand('id --clipboard')
    expect(stdout).to.equal('Copied Jira Issue Key to clipboard: 54321\n')
  })
})
