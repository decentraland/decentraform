import { promises as fsPromises } from 'fs'
export async function exists(path: string) {
  try {
    await fsPromises.stat(path)
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false
    } else {
      throw e
    }
  }
  return true
}
