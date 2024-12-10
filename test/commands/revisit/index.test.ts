import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('revisit:index', () => {
  it('runs revisit:index cmd', async () => {
    const {stdout} = await runCommand('revisit:index')
    expect(stdout).to.contain('hello world')
  })

  it('runs revisit:index --name oclif', async () => {
    const {stdout} = await runCommand('revisit:index --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
