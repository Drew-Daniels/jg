import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('pr', () => {
  it('runs pr cmd', async () => {
    const { stdout } = await runCommand('pr')
    expect(stdout).to.contain('hello world')
  })
})
