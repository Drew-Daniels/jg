import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('key', () => {
  beforeEach(() => {
    sinon.stub(utils, 'getJiraIssueKeyFromCurrentBranch').resolves('EMR-12345')
    sinon.stub(utils, 'pbcopy')
  })

  it('runs key cmd', async () => {
    const { stdout } = await runCommand('key')
    expect(stdout).to.equal('EMR-12345\n')
  })
})
