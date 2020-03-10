export function normalizeDeploymentEntity(entity: any) {
  delete entity.id
  delete entity.timestamp
  entity.content = entity.content.filter(_ => _.file !== 'scene.json')
  return entity
}

const DEBUG_LOG = false

export async function localAndRemoteAreTheSame(local: any, remoteRaw: any) {
  normalizeDeploymentEntity(local)

  const filteredRemotes = remoteRaw.filter((_: any) => _.pointers.some(($: string) => local.pointers.includes($)))
  if (!filteredRemotes.length) {
    return false
  }
  const remote = filteredRemotes[0]
  normalizeDeploymentEntity(remote)

  return deepEqual(local, remote)
}

function deepEqual(a: any, b: any) {
  if (typeof a !== typeof b) {
    DEBUG_LOG && console.log(`typeof ${a} is ${typeof a}, typeof ${b} is ${typeof b}`)
    return false
  }
  if (typeof a === 'object') {
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) {
        DEBUG_LOG && console.log(`${b} is not an array`)
        return false
      }
      if (a.length !== b.length) {
        DEBUG_LOG && console.log(`different lengths: ${a.length}, ${b.length}`)
        return false
      }
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) {
          DEBUG_LOG && console.log(`different on key ${i}: ${a}, ${b}`)
          return false
        }
      }
    }
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) {
      DEBUG_LOG && console.log(`different key lengths for objects ${a}, ${b}`)
      return false
    }
    for (let key of keysA) {
      if (b[key] === undefined) {
        DEBUG_LOG && console.log(`missing key ${key} on second object`)
        return false
      }
      if (!deepEqual(a[key], b[key])) {
        DEBUG_LOG && console.log(`objects are different on ${key}: ${JSON.stringify(a[key])}, ${JSON.stringify(b[key])}`)

        return false
      }
    }
    return true
  }
  if (a !== b) {
    DEBUG_LOG && console.log(`about to differ on ${a.length} with ${b.length}, ${typeof a}, ${typeof b}`)
  }
  return a === b
}
