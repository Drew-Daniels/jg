import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('link', () => {
  let pbcopyStub: sinon.SinonStub
  beforeEach(() => {
    sinon.stub(utils, 'getJiraIssueKeyFromCurrentBranch').resolves('EMR-11111')
    sinon.stub(utils, 'getJiraIssueLink').resolves('https://jira.atlassian.com/browse/EMR-11111')
    pbcopyStub = sinon.stub(utils, 'pbcopy')
  })

  describe('when no options are passed', () => {
    it('prints the Jira Issue Link', async () => {
      const { stdout } = await runCommand('link')
      expect(stdout).to.equal('https://jira.atlassian.com/browse/EMR-11111\n')
    })
  })

  describe('when options are passed', () => {
    it('--clipboard prints the Jira Issue Link and copies it to the clipboard', async () => {
      const { stdout } = await runCommand('link --clipboard')
      expect(pbcopyStub.calledOnce).to.be.true
      expect(stdout).to.equal('Copied Jira Issue Link to clipboard: https://jira.atlassian.com/browse/EMR-11111\n')
    })
    it('--clipboard && --quiet copies the Jira Issue Link to the clipboard and suppresses output', async () => {
      const { stdout } = await runCommand('link --quiet --clipboard')
      expect(pbcopyStub.calledOnce).to.be.true
      expect(stdout).to.equal('')
    })
    it('--quiet without --clipboard throws an error', async () => {
      const { error } = await runCommand('link --quiet')
      expect(pbcopyStub.calledOnce).to.be.false
      expect(error?.message).to.contain('Cannot use --quiet without --clipboard')
    })
    it('--help prints the help', async () => {
      const { stdout } = await runCommand('link --help')
      expect(stdout).to.contain('Copies Jira Issue ID, Markdown Link, or Link to clipboard')
    })
  })
})
