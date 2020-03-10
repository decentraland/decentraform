import { expect } from 'chai'
import path from 'path'
import { getValidationError } from './getValidationError'

describe('validation errors', () => {
  it('deploy object check', async () => {
    expect(await getValidationError('a string is not valid', '', 'scene map')).to.eq(
      'invalid deploy: a string is not valid should be an object'
    )
  })
  it('network check', async () => {
    expect(await getValidationError({ network: 'invalid' }, '', 'scene map')).to.eq(
      'invalid deploy: invalid network should be in ropsten,mainnet'
    )
  })
  it('scene.json check', async () => {
    expect(
      await getValidationError(
        { network: 'mainnet', source: 'scenes/inexistent' },
        path.join(__dirname, 'test_data/example_scenes'),
        'scene map'
      )
    ).to.eq(`invalid deploy: scenes/inexistent folder does not contain a scene.json file`)
  })
  const exampleScenes = path.join(__dirname, 'test_data/example_scenes')
  const beforeTarget = { network: 'mainnet', source: 'scenes/something-for-ropsten-0.0' }
  it('target object check', async () => {
    expect(await getValidationError(beforeTarget, exampleScenes, 'scene map')).to.eq(
      `invalid deploy: ${undefined} should be an object`
    )
  })
  it('target contract object check', async () => {
    expect(await getValidationError({ ...beforeTarget, targetContract: '0x123123' }, exampleScenes, 'scene map')).to.eq(
      `invalid deploy: ${undefined} should be an object`
    )
  })
  it('target base check', async () => {
    expect(
      await getValidationError(
        {
          ...beforeTarget,
          target: {
            base: ''
          }
        },
        exampleScenes,
        'scene map'
      )
    ).to.eq(`invalid deploy:  should be a coordinate`)
    expect(
      await getValidationError(
        {
          ...beforeTarget,
          target: {
            base: 'hello'
          }
        },
        exampleScenes,
        'scene map'
      )
    ).to.eq(`invalid deploy: hello should be a coordinate`)
    expect(
      await getValidationError(
        {
          ...beforeTarget,
          target: {
            base: '0,'
          }
        },
        exampleScenes,
        'scene map'
      )
    ).to.eq(`invalid deploy: 0, should be a coordinate`)
  })
  it('target parcels check', async () => {
    expect(
      await getValidationError(
        {
          ...beforeTarget,
          target: {
            base: '0,0',
            parcels: ['hello']
          }
        },
        exampleScenes,
        'scene map'
      )
    ).to.eq(`invalid deploy: hello should be an array of valid coordinates`)
    expect(
      await getValidationError(
        {
          ...beforeTarget,
          target: {
            base: '0,0',
            parcels: { hello: true }
          }
        },
        exampleScenes,
        'scene map'
      )
    ).to.eq(`invalid deploy: [object Object] should be an array of valid coordinates`)
    expect(
      await getValidationError(
        {
          ...beforeTarget,
          target: {
            base: '0,0',
            parcels: 'hello'
          }
        },
        exampleScenes,
        'scene map'
      )
    ).to.eq(`invalid deploy: hello should be an array of valid coordinates`)
  })
})
