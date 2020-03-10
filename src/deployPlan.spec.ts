import path from 'path'
import { deployPlan } from './deployPlan'

describe('deploy [huge integration test]', () => {
  it('executes planned deployment', async () => {
    const basePath = path.join(__dirname, 'test_data')

    const planPath = path.join(basePath, 'plan_test')
    const configPath = path.join(basePath, 'example_config')
    const environment = {
      UNLOCK_0xdc1acf3F52Ae685fE474019d74efE8d23d2b89F6: 'password',
      UNLOCK_0xdc1f85752244F55b85CC8681eC3Bba8B5d398716: 'password'
    }
    try {
      await deployPlan(planPath, configPath, environment, { verbose: false, dryRun: true})
    } catch (e) {
      console.error(e.stack)
      throw e
    }
  }).timeout(30000)
})
