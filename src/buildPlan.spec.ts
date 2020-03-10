import { expect } from 'chai'
import path from 'path'
import tmp from 'tmp'
import { buildPlan } from './buildPlan'
import { readJson } from './readJson'

const getTempFolder = () =>
  new Promise<{ dir: string; remove: any }>((resolve, reject) => {
    tmp.dir({ prefix: 'target' }, (err, dir, remove) => {
      if (err) {
        return reject(err)
      }
      return resolve({ dir, remove })
    })
  })

describe('build a plan.json file [huge integration test]', () => {
  it('should not deploy already deployed', async () => {
    const basePath = path.join(__dirname, 'test_data')
    const { dir: targetPath, remove } = await getTempFolder()

    const configPath = path.join(basePath, 'example_config')
    const scenesPath = path.join(basePath, 'build', 'scenes')
    const deployPath = path.join(basePath, 'build', 'deploy')
    const nodeModules = path.join(__dirname, '..', 'node_modules')
    const environment = {
      UNLOCK_0xdc1acf3F52Ae685fE474019d74efE8d23d2b89F6: 'password',
      UNLOCK_0xdc1f85752244F55b85CC8681eC3Bba8B5d398716: 'password'
    }
    try {
      const result = await buildPlan(configPath, scenesPath, deployPath, targetPath, nodeModules, environment)
      expect(result).to.deep.eq({})
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      await remove()
    }
  }).timeout(30000)
  it('should plan deployment', async () => {
    const basePath = path.join(__dirname, 'test_data')
    const { dir: targetPath, remove } = await getTempFolder()

    const configPath = path.join(basePath, 'example_config')
    const scenesPath = path.join(basePath, 'build', 'scenes')
    const deployPath = path.join(basePath, 'build', 'deploy-delta')
    const nodeModules = path.join(__dirname, '..', 'node_modules')
    const environment = {
      UNLOCK_0xdc1acf3F52Ae685fE474019d74efE8d23d2b89F6: 'password',
      UNLOCK_0xdc1f85752244F55b85CC8681eC3Bba8B5d398716: 'password'
    }
    try {
      const result = await buildPlan(configPath, scenesPath, deployPath, targetPath, nodeModules, environment)
      expect(result).to.deep.eq({
        'fail-test': await readJson(path.join(deployPath, 'fail-test', 'deploy.json'))
      })
    } catch (e) {
      console.error(e.stack)
      throw e
    } finally {
      remove()
    }
  }).timeout(30000)
})
