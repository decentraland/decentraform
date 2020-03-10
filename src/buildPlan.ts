import { readJson } from './readJson'
import path from 'path'
import { promises as fs } from 'fs'
import { getAddressToKeyfileMap } from './getAddressToKeyfileMap'
import { exploreFolder } from './exploreFolder'
import { createTarget } from './createTarget'
import fetch from 'node-fetch'
import { assertKeysAreFound, missingKey } from './assertKeysAreFound'
import { assertEnvironmentPasswords, missingPassword } from './assertEnvironmentPasswords'
import { getCurrentDeployments } from './getCurrentDeployments'
import { localAndRemoteAreTheSame } from './compareDeployment'
import { runDclBuildEntity } from './runDclBuildEntity'

const DEBUG_LOG = false

export async function buildPlan(
  configFolder: string,
  scenesFolder: string,
  deploysFolder: string,
  targetFolder: string,
  nodeModules: string,
  environment: Record<string, string>,
  fetchFunction = fetch
) {
  DEBUG_LOG && console.log('a')
  const keysFolder = path.join(configFolder, 'keys')
  const addressMap = await readJson(path.join(configFolder, 'addresses.json'))
  const keyMap = await getAddressToKeyfileMap(keysFolder)

  DEBUG_LOG && console.log('b')
  const deployInfo = await exploreFolder(deploysFolder, scenesFolder)
  DEBUG_LOG && console.log('c', deployInfo)

  if (!(await assertKeysAreFound(deployInfo, addressMap, keysFolder))) {
    throw new Error(`Some key has not been found: ${await missingKey(deployInfo, addressMap, keysFolder)}`)
  }
  if (!assertEnvironmentPasswords(Object.keys(keyMap), environment)) {
    throw new Error(
      `Some address has a missing environment password: ${missingPassword(Object.keys(keyMap), environment)}`
    )
  }
  DEBUG_LOG && console.log('d')
  await createTarget(deployInfo, scenesFolder, targetFolder, nodeModules)
  DEBUG_LOG && console.log('e')

  const missingTargets = {}
  const deployNames = Object.keys(deployInfo)
  for (let deploy of deployNames) {
    const remote = await getCurrentDeployments(deployInfo[deploy], fetchFunction)
    const workingFolder = path.join(targetFolder, deploy)
    try {
      DEBUG_LOG && console.log('f', workingFolder)
      await runDclBuildEntity(workingFolder)
      DEBUG_LOG && console.log('g', remote)
    } catch (e) {
      DEBUG_LOG && console.log(e)
      throw e
    }
    const local = await readJson(path.join(workingFolder, 'entity.json'))

    DEBUG_LOG && console.log('h', local)
    if (!(await localAndRemoteAreTheSame(local, remote))) {
      missingTargets[deploy] = deployInfo[deploy]
    }
  }

  DEBUG_LOG && console.log('i')
  await fs.writeFile(path.join(targetFolder, 'plan.json'), JSON.stringify(missingTargets))
  return missingTargets
}
