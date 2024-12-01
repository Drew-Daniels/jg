import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('key:index', () => {
  it('runs key:index cmd', async () => {
    const {stdout} = await runCommand('key:index')
    expect(stdout).to.contain('hello world')
  })

  it('runs key:index --name oclif', async () => {
    const {stdout} = await runCommand('key:index --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
