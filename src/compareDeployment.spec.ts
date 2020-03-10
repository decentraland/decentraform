import path from 'path'
import { expect } from 'chai'
import { localAndRemoteAreTheSame } from './compareDeployment'
import { readJson } from './readJson'

describe('compare deployments', () => {
  it('works with two sample files', async () => {
    const a = await readJson(path.join(__dirname, 'test_data', 'entities/local.json'))
    const b = await readJson(path.join(__dirname, 'test_data', 'entities/remote.json'))

    expect(await localAndRemoteAreTheSame(a, b)).to.be.true
  })
})
