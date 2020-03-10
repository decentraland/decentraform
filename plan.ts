import path from 'path'
import { promises as fs } from 'fs'
import { buildPlan } from './src/buildPlan'

async function main() {
  const basePath = __dirname
  const target = path.join(basePath, 'targets')

  const configPath = path.join(basePath, 'config')
  const scenesPath = basePath
  const deployPath = path.join(basePath, 'deploys')
  const nodeModules = path.join(__dirname, 'node_modules')
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
    const result = await buildPlan(configPath, scenesPath, deployPath, target, nodeModules, environment)

    console.log(`Will deploy ${Object.keys(result).length} scenes:\n${JSON.stringify(result, null, 2)}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

if (!module.parent) {
  main().catch(e => {
    console.error(e)
    process.exit(1)
  })
}
