import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('related:index', () => {
  it('runs related:index cmd', async () => {
    const {stdout} = await runCommand('related:index')
    expect(stdout).to.contain('hello world')
  })

  it('runs related:index --name oclif', async () => {
    const {stdout} = await runCommand('related:index --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
