import { expect } from 'chai'
import { checkAddressMapping } from './checkAddressMapping'

describe('checkAddressMapping', () => {
  it('valid case', async () => {
    expect(
      checkAddressMapping(
        {
          someScene: {
            target: {
              base: '100,20',
              parcels: ['100,20']
            }
          }
        },
        {
          '100,20': {
            deployer: '0x7A73483784ab79257bB11B96Fd62A2C3AE4Fb75B'
          }
        }
      )
    ).to.eq(true)
  })
  it('invalid case', async () => {
    expect(
      checkAddressMapping(
        {
          scene: {
            target: {
              base: '0,0',
              parcels: ['0,0']
            }
          }
        },
        {
          '100,20': {
            deployer: '0x7A73483784ab79257bB11B96Fd62A2C3AE4Fb75B'
          }
        }
      )
    ).to.eq(false)
  })
})
