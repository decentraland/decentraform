import { execute } from './execute'

export async function runDclBuildEntity(targetFolder: string) {
  return await execute('dcl', ['deploy'], targetFolder, { DCL_PRIVATE_KEY: '1111111111111111111111111111111111111111111111111111111111111111' })
}
