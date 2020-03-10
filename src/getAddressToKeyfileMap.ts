import { promises as fs } from 'fs'
import path from 'path'
import { Address } from 'web3x/address'

export async function getAddressToKeyfileMap(keysFolder: string) {
  const files = await fs.readdir(keysFolder)

  const addressJsons = await Promise.all(
    files.map(async (_: string) => JSON.parse((await fs.readFile(path.join(keysFolder, _))).toString()))
  )
  const result = {}
  for (let i = 0; i < files.length; i++) {
    if (typeof addressJsons[i].address === 'string') {
      result[Address.fromString(addressJsons[i].address).toString()] = path.join(keysFolder, files[i])
    }
  }
  return result
}
