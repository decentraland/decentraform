import { expect } from 'chai'
import path from 'path'

import { assertKeysAreFound } from './assertKeysAreFound'

describe('assertKeysAreFound', () => {
  it('from a folder', async () => {
    const basePath = path.join(__dirname, 'test_data', 'example_config', 'keys')
    const addressMap = {
      mainnet: {
        '0,0': {
          deployer: '0xdc1acf3F52Ae685fE474019d74efE8d23d2b89F6'
        }
      }
    }
    expect(
      await assertKeysAreFound(
        {
          '00-scene': {
            source: 'scenes/something',
            network: 'mainnet',
            target: {
              base: '0,0',
              parcels: ['0,0']
            }
          }
        },
        addressMap,
        basePath
      )
    ).to.eq(true)
  })
})
