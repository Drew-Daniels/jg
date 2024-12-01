import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('key', () => {
  beforeEach(() => {
    sinon.stub(utils, 'getJiraIssueKeyFromCurrentBranch').resolves('EMR-12345')
    sinon.stub(utils, 'pbcopy')
  })

  describe('when no options are passed', () => {
    it('prints the Jira Issue Key', async () => {
      const { stdout } = await runCommand('key')
      expect(stdout).to.equal('EMR-12345\n')
    })
  })
  describe('when options are passed', () => {
    it('--clipboard prints the Jira Issue Key and copies it to the clipboard', async () => {
      const { stdout } = await runCommand('key --clipboard')
      expect(stdout).to.equal('Copied Jira Issue Key to clipboard: EMR-12345\n')
    })
    it('--clipboard && --quiet copies the Jira Issue Key to the clipboard and suppresses output', async () => {
      const { stdout } = await runCommand('key --quiet --clipboard')
      expect(stdout).to.equal('')
    })
    it('--quiet without --clipboard throws an error', async () => {
      const { error } = await runCommand('key --quiet')
      expect(error?.message).to.contain('Cannot use --quiet without --clipboard')
    })
    it('--help prints help', async () => {
      const { stdout } = await runCommand('key --help')
      expect(stdout).to.contain('Returns Jira Issue Key from current Git branch')
    })
  })
})
