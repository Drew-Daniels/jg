import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('bname', () => {
  it('runs bname cmd', async () => {
    const { stdout } = await runCommand('bname')
    expect(stdout).to.contain('hello world')
  })
})
