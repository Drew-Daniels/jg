import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('cc:index', () => {
  it('runs cc:index cmd', async () => {
    const {stdout} = await runCommand('cc:index')
    expect(stdout).to.contain('hello world')
  })

  it('runs cc:index --name oclif', async () => {
    const {stdout} = await runCommand('cc:index --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
