export type DeployInfo = {
  source: string
  targetContract?: string
  network: 'ropsten' | 'mainnet'
  target: {
    base: string
    parcels: string[]
  }
}
