import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('id', () => {
  beforeEach(() => {
    sinon.stub(utils, 'getJiraIssueKeyFromCurrentBranch').resolves('EMR-54321')
    sinon.stub(utils, 'pbcopy')
  })

  it('runs id cmd', async () => {
    const { stdout } = await runCommand('id')
    expect(stdout).to.equal('54321\n')
  })
})
