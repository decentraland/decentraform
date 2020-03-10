import globalFetch from 'node-fetch'
import { DeployInfo } from './DeployInfo'

const deployServers = {
  ropsten: 'peer.decentraland.zone',
  mainnet: 'peer.decentraland.org'
}

const DEBUG_LOG = false

export async function getEntities(domain: string, parcels: string[], fetch = globalFetch) {
  const url = `https://${domain}/content/entities/scenes?pointer=`
  const result = await fetch(url + parcels.join('&pointer='))
  if (result.status !== 200) {
    throw new Error(`Unable to fetch ${parcels.join(',')}: ${await result.text()}`)
  }
  const data = await result.json()
  DEBUG_LOG && console.log(domain, parcels, data)
  return data
}

export async function getCurrentDeployments(deploy: DeployInfo, fetch = globalFetch) {
  const currentEntity = await getEntities(
    deploy.network === 'ropsten' ? deployServers.ropsten : deployServers.mainnet,
    deploy.target.parcels,
    fetch
  )
  return currentEntity
}
