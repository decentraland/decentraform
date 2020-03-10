import { promises as fs } from 'fs'
import path from 'path'

export async function deleteRecursively(target: string, ignore: string[] = []) {
  try {
    if (ignore.includes(path.basename(target))) {
      await fs.unlink(target)
      return
    }
    const stat = await fs.stat(target)
    if (stat.isDirectory()) {
      const files = await fs.readdir(target)
      await Promise.all(files.map(file => deleteRecursively(path.join(target, file), ignore)))
      await fs.rmdir(target)
    } else if (stat.isSymbolicLink()) {
      await fs.unlink(target)
    } else if (stat.isFile()) {
      await fs.unlink(target)
    } else {
      throw new Error(`Don't know what to do with ${target}: stat is ${JSON.stringify(stat)}`)
    }
  } catch (e) {
    if (e.errno === -2) {
      return
    }
    throw e
  }
}
