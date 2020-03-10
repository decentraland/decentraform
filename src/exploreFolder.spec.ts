import { expect } from 'chai'
import path from 'path'

import { exploreFolder } from './exploreFolder'

describe('exploreFolder', () => {
  it('lists a folder', async () => {
    const exampleDeploysFolder = path.resolve(__dirname, 'test_data', 'example_deploys')
    const exampleScenesFolder = path.resolve(__dirname, 'test_data', 'example_scenes')
    expect(await exploreFolder(exampleDeploysFolder, exampleScenesFolder)).to.deep.eq({
      '00-road': {
        source: 'scenes/totem-for-ropsten-100.0',
        network: 'ropsten',
        targetContract: '0x7A73483784ab79257bB11B96Fd62A2C3AE4Fb75B',
        target: { base: '100,0', parcels: ['100,0'] }
      },
      'other-deploys/10-scene': {
        source: 'scenes/something-for-ropsten-0.0',
        network: 'ropsten',
        target: { base: '-10,-20', parcels: ['-10,-20'] }
      },
      'other-deploys/20-another': {
        source: 'templates/thinking-about-mixing-networks',
        network: 'mainnet',
        target: { base: '10,-47', parcels: ['10,-47'] }
      }
    })
  })
})
