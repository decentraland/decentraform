import path from 'path'
import { execute } from './execute'

export async function runDclBuild(data: any, targetFolder: string) {
  const keys = Object.keys(data)
  await Promise.all(keys.map(_ => execute('npx', ['dcl', 'build'], path.join(targetFolder, _), {})))
}
