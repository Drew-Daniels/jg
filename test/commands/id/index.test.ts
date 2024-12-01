import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('id', () => {
  beforeEach(() => {
    sinon.stub(utils, 'getJiraIssueKeyFromCurrentBranch').resolves('EMR-54321')
    sinon.stub(utils, 'pbcopy')
  })
  describe('when no options are passed', () => {
    it('prints the Jira Issue ID', async () => {
      const { stdout } = await runCommand('id')
      expect(stdout).to.equal('54321\n')
    })
  })
  describe('when options are passed', () => {
    it('--clipboard prints the Jira Issue ID and copies it to the clipboard', async () => {
      const { stdout } = await runCommand('id --clipboard')
      expect(stdout).to.equal('Copied Jira Issue ID to clipboard: 54321\n')
    })
    it('--clipboard && --quiet copies the Jira Issue ID to the clipboard and suppresses output', async () => {
      const { stdout } = await runCommand('id --quiet --clipboard')
      expect(stdout).to.equal('')
    })
    it('--quiet without --clipboard throws an error', async () => {
      const { error } = await runCommand('id --quiet')
      expect(error?.message).to.contain('Cannot use --quiet without --clipboard')
    })
    it('--help prints the help', async () => {
      const { stdout } = await runCommand('id --help')
      expect(stdout).to.contain('Returns Jira Issue ID from current Git branch')
    })
  })
})
