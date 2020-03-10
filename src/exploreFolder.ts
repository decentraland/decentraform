import { promises as fs } from 'fs'
import path from 'path'
import { getValidationError } from './getValidationError'

const noHiddenFiles = (_: string) => !_.startsWith('.')

const DEBUG_LOGS = false

export async function exploreFolder(deploysFolder: string, scenesFolder: string, relativePath: string = '') {
  DEBUG_LOGS && console.log(`Exploring ${deploysFolder}`)
  const files = (await fs.readdir(deploysFolder)).filter(noHiddenFiles)
  if (files.includes('deploy.json')) {
    DEBUG_LOGS && console.log(`Folder ${path.basename(deploysFolder)} has a deploys file`)
    try {
      const deploy = JSON.parse((await fs.readFile(path.join(deploysFolder, 'deploy.json'))).toString())
      const validationError = await getValidationError(deploy, scenesFolder, relativePath)
      if (validationError) {
        return {
          error: validationError
        }
      }
      return {
        [relativePath]: deploy
      }
    } catch (e) {
      console.log(deploysFolder, e)
      return {
        error: e
      }
    }
  } else {
    const found = await Promise.all(
      files.map(_ => exploreFolder(path.join(deploysFolder, _), scenesFolder, path.join(relativePath, _)))
    )
    let result = {}
    for (let i = 0; i < files.length; i++) {
      if (found[i].error) {
        DEBUG_LOGS && console.log(`Error in the examination of ${deploysFolder}::${files[i]}`, found[i].error)
        throw new Error(`Validation error for ${files[i]}: ${found[i].error}`)
      } else {
        result = { ...result, ...found[i] }
      }
    }
    return result
  }
}
