import { promises as fs } from 'fs'
import path from 'path'
import { deployPlan } from './src/deployPlan'

async function main() {
  const basePath = __dirname
  const targets = path.join(basePath, 'targets')
  const configPath = path.join(basePath, 'config')
  const environment = Object.assign({}, process.env)
  try {
    Object.assign(
      environment,
      (await fs.readFile('.env'))
        .toString()
        .split('\n')
        .filter(_ => _.includes('='))
        .reduce((prev, next) => ({ ...prev, [next.split('=')[0]]: next.split('=')[1] }), {})
    )
  } catch (e) {
    // Pass
  }
  try {
    await deployPlan(targets, configPath, environment, {
      verbose: true,
      dryRun: false
    })
  } catch (e) {
    console.error(e.stack)
    throw e
  }
}

if (!module.parent) {
  main().catch(e => {
    console.error(e)
    process.exit(1)
  })
}
