import { promises as fs } from 'fs'
import path from 'path'
import { readSceneJsonFromDir } from './readSceneJsonFromDir'
import { splitCoords } from './splitCoords'
import { exists } from './exists'
import { ghostRecursively } from './copyRecursively'

async function createNodeModulesLink(targetFolder: string, nodeModules: string) {
  const target = path.join(targetFolder, 'node_modules')
  if (await exists(target)) {
    return
  }
  return await fs.symlink(nodeModules, target, 'dir')
}

export async function createTarget(data: any, scenesFolder: string, targetFolder: string, nodeModules: string) {
  const keys = Object.keys(data)
  await Promise.all(
    keys.map(_ => {
      return ghostRecursively(path.join(scenesFolder, data[_].source), path.join(targetFolder, _), ['scene.json', 'node_modules'])
    })
  )
  await Promise.all(keys.map(_ => createNodeModulesLink(path.join(targetFolder, _), nodeModules)))

  await Promise.all(
    keys.map(async _ => {
      const sceneDescription = data[_].target
      const originalSceneJson = await readSceneJsonFromDir(path.join(targetFolder, _))
      const [baseX, baseY] = splitCoords(sceneDescription.base)
      const [originalX, originalY] = splitCoords(originalSceneJson.scene.base)
      for (let parcel of sceneDescription.parcels) {
        const [x, y] = splitCoords(parcel)
        const [deltaX, deltaY] = [x - baseX, y - baseY]
        const [targetX, targetY] = [originalX + deltaX, originalY + deltaY]
        if (!originalSceneJson.scene.parcels.includes(`${targetX},${targetY}`)) {
          throw new Error(
            `Scene coordinates mismatch: ${_}'s source, ${
              data[_].source
            } has a different shape in the scene.json that doesn't match the planned deployment of: ${JSON.stringify(
              sceneDescription
            )}`
          )
        }
      }
      originalSceneJson.scene = sceneDescription
      await fs.writeFile(path.join(targetFolder, _, 'scene.json'), JSON.stringify(originalSceneJson, null, 2))
    })
  )
}
