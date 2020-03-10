import { expect } from 'chai'
import path from 'path'
import { assertEnvironmentPasswords, assertCorrectPassword } from './assertEnvironmentPasswords'

describe('assertEnvironmentPasswords', () => {
  it('from environment', async () => {
    const addressess = ['0xdc1acf3F52Ae685fE474019d74efE8d23d2b89F6']
    expect(
      assertEnvironmentPasswords(addressess, {
        UNLOCK_0xdc1acf3F52Ae685fE474019d74efE8d23d2b89F6: 'password'
      })
    ).to.eq(true)
  })
  it('false', async () => {
    const addressess = ['0xdc1acf3F52Ae685fE474019d74efE8d23d2b89F6']
    expect(assertEnvironmentPasswords(addressess, {})).to.eq(false)
  })
  it('unlocks correctly', async () => {
    const basePath = path.join(
      __dirname,
      'test_data',
      'example_config',
      'keys',
      'UTC--2020-03-08T01-27-34.955Z--0xdc1acf3f52ae685fe474019d74efe8d23d2b89f6'
    )
    expect(
      await assertCorrectPassword(basePath, { UNLOCK_0xdc1acf3F52Ae685fE474019d74efE8d23d2b89F6: 'password' })
    ).to.eq(true)
  })
  it('false password', async () => {
    const basePath = path.join(
      __dirname,
      'test_data',
      'example_config',
      'keys',
      'UTC--2020-03-08T01-27-34.955Z--0xdc1acf3f52ae685fe474019d74efe8d23d2b89f6'
    )
    expect(
      await assertCorrectPassword(basePath, { UNLOCK_0xdc1acf3F52Ae685fE474019d74efE8d23d2b89F6: 'something wrong?' })
    ).to.eq(false)
  })
})
