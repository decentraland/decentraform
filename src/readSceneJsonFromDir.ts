import { promises as fs } from 'fs'
import path from 'path'
export async function readSceneJsonFromDir(folderName: string) {
  return JSON.parse((await fs.readFile(path.join(folderName, 'scene.json'))).toString())
}
