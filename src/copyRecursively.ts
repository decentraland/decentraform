import { promises as fs } from 'fs'
import path from 'path'
import { ensureFolder } from './ensureFolder'
import { exists } from './exists'

export async function ghostRecursively(from: string, to: string, ignore: string[] = []) {
  return recursively(from, to, ignore, (a: string, b: string) => fs.symlink(b, a, 'file'))
}
export async function copyRecursively(from: string, to: string, ignore: string[] = []) {
  return recursively(from, to, ignore, fs.copyFile)
}

export async function recursively(from: string, to: string, ignore: string[] = [], action: (a: string, b: string) => Promise<any>) {
  if (ignore.includes(path.basename(from))) {
    return
  }
  const stat = await fs.stat(from)
  if (stat.isSymbolicLink()) {
    if (path.basename(from) === 'node_modules') {
      return
    }
  } else if (stat.isDirectory()) {
    await ensureFolder(to)
    const files = (await fs.readdir(from)).filter(_ => _ !== '.')
    return await Promise.all(files.map(_ => copyRecursively(path.join(from, _), path.join(to, _))))
  } else if (stat.isFile()) {
    if (await exists(to)) {
      const toStat = await fs.stat(to)
      if (stat.mtime <= toStat.mtime) {
        return
      }
    }
    return await action(from, to)
  }
  throw new Error(`Don't know what to do with file: ${from}, stat is: ${JSON.stringify(stat)}`)
}
