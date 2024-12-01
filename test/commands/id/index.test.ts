import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('id', () => {
  it('runs id cmd', async () => {
    const fakeUtils = {
      async getJiraIssueKeyFromCurrentBranch() {
        return 'EMR-11111';
      },
      pbcopy() { }
    }
    sinon.replace(utils, 'getJiraIssueKeyFromCurrentBranch', fakeUtils.getJiraIssueKeyFromCurrentBranch)
    sinon.replace(utils, 'pbcopy', fakeUtils.pbcopy)
    const { stdout } = await runCommand('id')
    expect(stdout).to.contain('EMR-11111')
  })
})
