import { promises as fs } from 'fs'
import path from 'path'
import { Address } from 'web3x/address'
import { knownNetworks } from './knownNetworks'
import { validCoordinate } from './validCoordinate'
import { splitCoords } from './splitCoords'
import { readSceneJsonFromDir } from './readSceneJsonFromDir'

export async function getValidationError(
  deploy: any,
  scenesFolder: string,
  deployName: string
): Promise<string | undefined> {
  if (typeof deploy !== 'object') {
    return `invalid deploy: ${deploy} should be an object`
  }
  if (typeof deploy.network !== 'string' || !knownNetworks.includes(deploy.network)) {
    return `invalid deploy: ${deploy.network} network should be in ${knownNetworks.join(',')}`
  }
  try {
    await fs.stat(path.resolve(scenesFolder, deploy.source, 'scene.json'))
  } catch (e) {
    return `invalid deploy: ${deploy.source} folder does not contain a scene.json file`
  }
  if (typeof deploy.target !== 'object') {
    return `invalid deploy: ${deploy.target} should be an object`
  }
  if (typeof deploy.target.base !== 'string' || !validCoordinate(deploy.target.base)) {
    return `invalid deploy: ${deploy.target.base} should be a coordinate`
  }
  if (
    typeof deploy.targetContract === 'string' &&
    Address.fromString(deploy.targetContract).toString() !== deploy.targetContract
  ) {
    return `invalid deploy: ${deploy.targetContract} is invalid or has an invalid checksum`
  }
  if (
    typeof deploy.target.parcels !== 'object' ||
    !Array.isArray(deploy.target.parcels) ||
    deploy.target.parcels.some((_: string) => !validCoordinate(_))
  ) {
    return `invalid deploy: ${deploy.target.parcels} should be an array of valid coordinates`
  }
  const jsonShapeError = jsonShapeMatchError(deployName, deploy, await readSceneJsonFromDir(path.join(scenesFolder, deploy.source)))
  if (jsonShapeError) {
    return jsonShapeError
  }
}

type ParcelShape = { base: string; parcels: string[] }
function jsonShapeMatchError(
  deployName: string,
  deploy: { target: ParcelShape; source: string },
  source: { scene: ParcelShape }
) {
  const [baseX, baseY] = splitCoords(deploy.target.base)
  const [originalX, originalY] = splitCoords(source.scene.base)
  for (let parcel of deploy.target.parcels) {
    const [x, y] = splitCoords(parcel)
    const [deltaX, deltaY] = [x - baseX, y - baseY]
    const [targetX, targetY] = [originalX + deltaX, originalY + deltaY]
    if (!source.scene.parcels.includes(`${targetX},${targetY}`)) {
      return `Scene coordinates mismatch: ${deployName}'s source, ${
        deploy.source
      } has a different shape in the scene.json that doesn't match the planned deployment of: ${JSON.stringify(
        deploy.target
      )}`
    }
  }
}
