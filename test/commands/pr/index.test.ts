import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('pr:index', () => {
  it('runs pr:index cmd', async () => {
    const {stdout} = await runCommand('pr:index')
    expect(stdout).to.contain('hello world')
  })

  it('runs pr:index --name oclif', async () => {
    const {stdout} = await runCommand('pr:index --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
