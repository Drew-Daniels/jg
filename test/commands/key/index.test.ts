import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('key', () => {
  beforeEach(() => {
    sinon.stub(utils, 'getJiraIssueKeyFromCurrentBranch').resolves('EMR-11111')
    sinon.stub(utils, 'pbcopy')
  })
  afterEach(() => {
    sinon.restore()
  })

  it('runs key cmd', async () => {
    const { stdout } = await runCommand('key')
    expect(stdout).to.equal('EMR-11111\n')
  })
})
