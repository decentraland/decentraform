import { getCurrentDeployments } from './getCurrentDeployments'
import { testFetchMock } from './testFetchMock'

describe('getCurrentDeployment', () => {
  it('fetches correctly info', async () => {
    const data = await getCurrentDeployments(
      {
        source: 'scenes/totem-for-ropsten-100.0',
        network: 'ropsten',
        targetContract: '0x7A73483784ab79257bB11B96Fd62A2C3AE4Fb75B',
        target: { base: '100,0', parcels: ['100,0'] }
      },
      testFetchMock as any
    )
  })
})
