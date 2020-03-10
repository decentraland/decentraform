import { DeployInfo } from './DeployInfo'
import { getAddressToKeyfileMap } from './getAddressToKeyfileMap'

const DEBUG_LOG = false
export async function assertKeysAreFound(
  deploy: Record<string, DeployInfo>,
  addressMap: Record<string, Record<string, { deployer: string }>>,
  keysFolder: string
) {
  const keys = await getAddressToKeyfileMap(keysFolder)
  for (let deployName of Object.keys(deploy)) {
    const data = deploy[deployName]
    const addressMapInNetwork = addressMap[data.network || 'mainnet'] || {}
    DEBUG_LOG && console.log(`Step 1: addressMap is `, addressMapInNetwork)
    if (!addressMapInNetwork[data.target.base]) {
      return false
    }
    const address = addressMapInNetwork[data.target.base]
    DEBUG_LOG && console.log(`Step 2: address is `, address.deployer)
    if (!keys[address.deployer]) {
      return false
    }
    DEBUG_LOG && console.log(`Step 3: key is `, keys[address.deployer])
  }
  return true
}

export async function missingKey(
  deploy: Record<string, DeployInfo>,
  addressMap: Record<string, { deployer: string }>,
  keysFolder: string
) {
  const keys = await getAddressToKeyfileMap(keysFolder)
  for (let deployName of Object.keys(deploy)) {
    const data = deploy[deployName]
    const addressMapInNetwork = addressMap[data.network || 'mainnet'] || {}
    if (!addressMapInNetwork[data.target.base]) {
      return `${deployName}, with a base of ${data.target.base}, has no associated address!`
    }
    const address = addressMapInNetwork[data.target.base].deployer
    if (!keys[address]) {
      return `${deployName} (${data.target.base}) ${JSON.stringify(address)} has no key`
    }
  }
}
