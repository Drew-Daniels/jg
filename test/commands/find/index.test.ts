import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('find', () => {
  it('runs find cmd', async () => {
    const { stdout } = await runCommand('find')
    expect(stdout).to.contain('hello world')
  })

  it('runs find --name oclif', async () => {
    const { stdout } = await runCommand('find --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
