import { readJson } from './readJson'
import path from 'path'
import { getAddressToKeyfileMap } from './getAddressToKeyfileMap'
import { assertKeysAreFound, missingKey } from './assertKeysAreFound'
import { assertEnvironmentPasswords, missingPassword, unlockWallet } from './assertEnvironmentPasswords'
import { DeployInfo } from './DeployInfo'
import { runDclDeploy } from './runDclDeploy'
import { domains } from './knownNetworks'

const DEBUG_LOG = false
export async function deployPlan(
  targetFolder: string,
  configFolder: string,
  environment: Record<string, string>,
  options = {
    verbose: true,
    dryRun: false
  }
) {
  const plan = await readJson(path.join(targetFolder, 'plan.json'))
  const keysFolder = path.join(configFolder, 'keys')
  const addressMap = await readJson(path.join(configFolder, 'addresses.json'))
  const keyMap = await getAddressToKeyfileMap(keysFolder)

  DEBUG_LOG && console.log(addressMap, keyMap, plan)

  if (!(await assertKeysAreFound(plan, addressMap, keysFolder))) {
    throw new Error(`Some key has not been found: ${await missingKey(plan, addressMap, keysFolder)}`)
  }
  if (!assertEnvironmentPasswords(Object.keys(keyMap), environment)) {
    throw new Error(
      `Some address has a missing environment password: ${missingPassword(Object.keys(keyMap), environment)}`
    )
  }
  DEBUG_LOG && console.log(`Will deploy ${Object.keys(plan).length} scenes...`)

  for (let deploy of Object.keys(plan)) {
    const address = getAddressForDeploy(plan[deploy], addressMap)
    DEBUG_LOG && console.log(address, keyMap, addressMap)
    const key = await unlockWallet(keyMap[address], environment)
    if (options.dryRun) {
      continue
    }
    await runDclDeploy(
      path.join(targetFolder, deploy),
      domains[plan[deploy].network || 'mainnet'],
      key.accounts[0].privateKey.toString('hex'),
      options
    )
    console.log(`Deployed: ${deploy} (${plan[deploy].target.base})`)
  }
}

function getAddressForDeploy(deploy: DeployInfo, addressMap: Record<string, Record<string, { deployer: string }>>) {
  return (addressMap[deploy.network || 'mainnet'] || {})[deploy.target.base].deployer
}
