import path from 'path'
import { promises as fsPromises } from 'fs'
import { exists } from './exists'

export async function ensureFolder(folder: string) {
  if (await exists(folder)) {
    const stat = await fsPromises.stat(folder)
    if (!stat.isDirectory()) {
      throw new Error(`Expected ${folder} to be a folder -- found a file or link`)
    }
    return
  } else {
    await fsPromises.mkdir(folder, { recursive: true })
  }
}
