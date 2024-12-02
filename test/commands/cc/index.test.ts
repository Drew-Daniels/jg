import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import sinon from 'sinon'

import utils from '../../../src/utils/index.js'

describe('cc', () => {
  let copyToClipboardStub: sinon.SinonStub
  let getExtractedIssueDataStub: sinon.SinonStub
  beforeEach(() => {
    sinon.stub(utils, 'getJiraIssueKeyFromCurrentBranch').resolves('EMR-11111')
    copyToClipboardStub = sinon.stub(utils, 'copyToClipboard')
  })
  describe('when run without arguments or options', () => {
    describe('and on a branch with a Jira Issue Key for a Story', () => {
      it('prints a Conventional Git Commit Message for Jira issue with no scopes', async () => {
        getExtractedIssueDataStub = sinon.stub(utils, 'getExtractedIssueData').resolves({ scopes: [], summary: 'This is an issue summary', type: 'Story' })
        const { stdout } = await runCommand('cc')
        expect(stdout).to.equal("feat: This is an issue summary\n")
      })
      it('prints a Conventional Git Commit Message for Jira issue with 1 scope', async () => {
        getExtractedIssueDataStub = sinon.stub(utils, 'getExtractedIssueData').resolves({ scopes: ['Scope'], summary: 'This is an issue summary', type: 'Story' })
        const { stdout } = await runCommand('cc')
        expect(stdout).to.equal("feat(Scope): This is an issue summary\n")
      })
      it('prints a Conventional Git Commit Message for Jira issue with 2 scopes', async () => {
        getExtractedIssueDataStub = sinon.stub(utils, 'getExtractedIssueData').resolves({ scopes: ['Scope1', 'Scope2'], summary: 'This is an issue summary', type: 'Story' })
        const { stdout } = await runCommand('cc')
        expect(stdout).to.equal("feat(Scope1:Scope2): This is an issue summary\n")
      })
      it('prints a Conventional Git Commit Message for Jira issue with 3 scopes', async () => {
        getExtractedIssueDataStub = sinon.stub(utils, 'getExtractedIssueData').resolves({ scopes: ['Scope1', 'Scope2', 'Scope3'], summary: 'This is an issue summary', type: 'Story' })
        const { stdout } = await runCommand('cc')
        expect(stdout).to.equal("feat(Scope1:Scope2:Scope3): This is an issue summary\n")
      })
    })
    describe('and on a branch with a Jira Issue Key for a Bug', () => {
      it('prints a Conventional Git Commit Message for Jira issue with no scopes', async () => {
        getExtractedIssueDataStub = sinon.stub(utils, 'getExtractedIssueData').resolves({ scopes: [], summary: 'This is an issue summary', type: 'Bug' })
        const { stdout } = await runCommand('cc')
        expect(stdout).to.equal("fix: This is an issue summary\n")
      })
    })
    describe('and not on a branch with a Jira Issue Key', () => {
      it('throws an error', async () => {
        const { error } = await runCommand('cc')
        expect(error?.message).to.equal('')
      })
    })

    describe('and not in a git repository', () => {
      it('throws an error', async () => {
        const { error } = await runCommand('cc')
        expect(error?.message).to.equal('')
      })
    })
  })
})
