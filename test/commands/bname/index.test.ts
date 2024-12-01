import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('bname:index', () => {
  it('runs bname:index cmd', async () => {
    const {stdout} = await runCommand('bname:index')
    expect(stdout).to.contain('hello world')
  })

  it('runs bname:index --name oclif', async () => {
    const {stdout} = await runCommand('bname:index --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
