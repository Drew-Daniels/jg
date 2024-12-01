import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('id:index', () => {
  it('runs id:index cmd', async () => {
    const {stdout} = await runCommand('id:index')
    expect(stdout).to.contain('hello world')
  })

  it('runs id:index --name oclif', async () => {
    const {stdout} = await runCommand('id:index --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
