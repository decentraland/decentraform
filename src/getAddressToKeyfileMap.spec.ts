import { expect } from 'chai'
import path from 'path'

import { getAddressToKeyfileMap } from './getAddressToKeyfileMap'

describe('getAddressToKeyfileMap', () => {
  it('lists a folder', async () => {
    const basePath = path.join(__dirname, 'test_data', 'example_config', 'keys')
    const addresses = await getAddressToKeyfileMap(basePath)
    expect(addresses).to.deep.eq({
      '0xdc1acf3F52Ae685fE474019d74efE8d23d2b89F6': path.join(
        basePath,
        'UTC--2020-03-08T01-27-34.955Z--0xdc1acf3f52ae685fe474019d74efe8d23d2b89f6'
      ),
      '0xdc1f85752244F55b85CC8681eC3Bba8B5d398716': path.join(
        basePath,
        'UTC--2020-03-07T22-04-30.261Z--0xdc1f85752244f55b85cc8681ec3bba8b5d398716'
      )
    })
  })
})
