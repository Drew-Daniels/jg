import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('cc', () => {
  it('runs cc cmd', async () => {
    const { stdout } = await runCommand('cc')
    expect(stdout).to.contain('hello world')
  })
})
