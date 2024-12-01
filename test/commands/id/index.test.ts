import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('id', () => {
  beforeEach(() => {
    sinon.stub(utils, 'getJiraIssueKeyFromCurrentBranch').resolves('EMR-11111')
    sinon.stub(utils, 'pbcopy')
  })
  afterEach(() => {
    sinon.restore()
  })

  it('runs id cmd', async () => {
    const { stdout } = await runCommand('id')
    expect(stdout).to.contain('EMR-11111')
  })
})
