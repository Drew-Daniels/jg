import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('pr', () => {
  describe('when no arguments or flags are passed', () => {
    describe('and on a Git branch with a Jira Issue key', () => {
      describe('and no PR can be found for that Jira Issue key', () => {
        it('throws an error')
      })
      describe('and a PR can be found for that Jira Issue key', () => {
        it('logs a Slack message with a link to the Jira Issue and that PR')
      })
      describe('and more than one PR can be found for that Jira Issue key', () => {
        it('logs a Slack message with a link to the Jira Issue and the most recent PR')
      })
    })
    describe('and on a Git branch without a Jira Issue key in the name', () => {
      it('throws an error')
    })
    describe('and not on a Git branch', () => {
      it('throws an error')
    })
  })
})
