import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('url', () => {
  let copyToClipboardStub: sinon.SinonStub
  beforeEach(() => {
    sinon.stub(utils, 'getJiraIssueKeyFromCurrentBranch').resolves('EMR-11111')
    sinon.stub(utils, 'getJiraIssueLink').returns('https://jira.atlassian.com/browse/EMR-11111')
    copyToClipboardStub = sinon.stub(utils, 'copyToClipboard')
  })

  describe('when no options are passed', () => {
    it('prints the Jira Issue url', async () => {
      const { stdout } = await runCommand('url')
      expect(stdout).to.equal('https://jira.atlassian.com/browse/EMR-11111\n')
    })
  })

  describe('when options are passed', () => {
    it('--clipboard prints the Jira Issue url and copies it to the clipboard', async () => {
      const { stdout } = await runCommand('url --clipboard')
      expect(copyToClipboardStub.calledOnce).to.be.true
      expect(stdout).to.equal('Copied to clipboard: https://jira.atlassian.com/browse/EMR-11111\n')
    })
    it('--clipboard & --quiet copies the Jira Issue url to the clipboard and suppresses output', async () => {
      const { stdout } = await runCommand('url --quiet --clipboard')
      expect(copyToClipboardStub.calledOnce).to.be.true
      expect(stdout).to.equal('')
    })
    it('--markdown prints the Jira Issue Markdown Link', async () => {
      const { stdout } = await runCommand('url --markdown')
      expect(stdout).to.equal('[EMR-11111](https://jira.atlassian.com/browse/EMR-11111)\n')
    })
    it('--clipboard & --markdown prints the Jira Issue Markdown Link and copies it to the clipboard', async () => {
      const { stdout } = await runCommand('url --markdown --clipboard')
      expect(copyToClipboardStub.calledOnce).to.be.true
      expect(stdout).to.equal('Copied to clipboard: [EMR-11111](https://jira.atlassian.com/browse/EMR-11111)\n')
    })
    it('--quiet without --clipboard throws an error', async () => {
      const { error } = await runCommand('url --quiet')
      expect(copyToClipboardStub.calledOnce).to.be.false
      expect(error?.message).to.contain('Cannot use --quiet without --clipboard')
    })
    it('--help prints the help', async () => {
      const { stdout } = await runCommand('url --help')
      expect(stdout).to.contain('Returns a URL to a Jira Issue')
    })
  })
})
