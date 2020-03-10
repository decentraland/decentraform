import { promises as fs } from 'fs'
import { Wallet } from 'web3x/wallet'
import { Address } from 'web3x/address'

const UNLOCK_ENV_PREFIX = 'UNLOCK_'
export function assertEnvironmentPasswords(addresses: string[], env: Record<string, string>) {
  for (let address of addresses) {
    if (!env[UNLOCK_ENV_PREFIX + address]) {
      return false
    }
  }
  return true
}

export function missingPassword(addresses: string[], env: Record<string, string>) {
  for (let address of addresses) {
    if (!env[UNLOCK_ENV_PREFIX + address]) {
      return address
    }
  }
}

export async function unlockWallet(keyFile: string, env: Record<string, string>) {
  const data = JSON.parse((await fs.readFile(keyFile)).toString())
  return Wallet.fromKeystores([data], env[UNLOCK_ENV_PREFIX + Address.fromString(data.address).toString()])
}

export async function assertCorrectPassword(keyFile: string, env: Record<string, string>) {
  try {
    await unlockWallet(keyFile, env)
    return true
  } catch (e) {
    return false
  }
}
