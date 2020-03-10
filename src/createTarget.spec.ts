import path from 'path'
import { expect } from 'chai'

import { createTarget } from './createTarget'
import { deleteRecursively } from './deleteRecursively'
import { exists } from './exists'
import { promises as fs } from 'fs'
import { readSceneJsonFromDir } from './readSceneJsonFromDir'

describe('createTarget', () => {
  const exampleScenesFolder = path.resolve(__dirname, 'test_data', 'example_scenes')
  const exampleTargetFolder = path.resolve(__dirname, 'test_data', 'example_target')

  it('checks scene.json shape', async () => {
    try {
      // Check that the target folder is empty just in case!
      await deleteRecursively(exampleTargetFolder, ['node_modules'])

      const exploration = {
        '00-road': {
          source: 'scenes/totem-for-ropsten-100.0',
          network: 'ropsten',
          targetContract: '0x7A73483784ab79257bB11B96Fd62A2C3AE4Fb75B',
          target: { base: '100,0', parcels: ['100,0', '100,2'] }
        }
      }
      try {
        await createTarget(
          exploration,
          exampleScenesFolder,
          exampleTargetFolder,
          path.join(__dirname, '..', 'node_modules')
        )
        expect(true).to.be.false
      } catch (e) {
        expect(e.message).to.eq(
          `Scene coordinates mismatch: 00-road's source, scenes/totem-for-ropsten-100.0 has a different shape in the scene.json that doesn't match the planned deployment of: {"base":"100,0","parcels":["100,0","100,2"]}`
        )
      }
    } finally {
      await deleteRecursively(exampleTargetFolder, ['node_modules'])
    }
  })

  it('recreates a target', async () => {
    // Check that the target folder is empty just in case!
    await deleteRecursively(exampleTargetFolder, ['node_modules'])

    try {
      const exploration = {
        '00-road': {
          source: 'scenes/totem-for-ropsten-100.0',
          network: 'ropsten',
          targetContract: '0x7A73483784ab79257bB11B96Fd62A2C3AE4Fb75B',
          target: { base: '100,0', parcels: ['100,0'] }
        }
      }
      try {
        await createTarget(
          exploration,
          exampleScenesFolder,
          exampleTargetFolder,
          path.join(__dirname, '..', 'node_modules')
        )
      } catch (e) {
        console.log(e.stack)
        throw e
      }
      const targetScene = path.join(exampleTargetFolder, '00-road', 'scene.json')
      expect(await exists(targetScene)).to.be.true

      const scene = JSON.parse((await fs.readFile(targetScene)).toString())
      expect(scene.scene.base).to.eq(exploration['00-road'].target.base)
    } finally {
      await deleteRecursively(exampleTargetFolder, ['node_modules'])
    }
  })

  it('overwrites target parcels', async () => {
    // Check that the target folder is empty just in case!
    await deleteRecursively(exampleTargetFolder, ['node_modules'])

    try {
      const exploration = {
        '00-road': {
          source: 'scenes/totem-for-ropsten-100.0',
          network: 'ropsten',
          targetContract: '0x7A73483784ab79257bB11B96Fd62A2C3AE4Fb75B',
          target: { base: '100,0', parcels: ['100,0'] }
        }
      }
      await createTarget(
        exploration,
        exampleScenesFolder,
        exampleTargetFolder,
        path.join(__dirname, '..', 'node_modules')
      )
      const targetScene = await readSceneJsonFromDir(path.join(exampleTargetFolder, '00-road'))
      expect(targetScene.scene.base).to.eq(exploration['00-road'].target.base)
    } finally {
      await deleteRecursively(exampleTargetFolder, ['node_modules'])
    }
  })
})
