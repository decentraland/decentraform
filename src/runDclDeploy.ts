import { execute } from './execute'

export async function runDclDeploy(targetFolder: string, domain: string, key: string, options?: any) {
  return execute('dcl', ['deploy', '--target', `https://${domain}/content`], targetFolder, { DCL_PRIVATE_KEY: key }, options)
}
