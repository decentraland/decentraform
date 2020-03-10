import { execute } from './execute'

describe('execute', () => {
  it('works', async () => {
    await execute('dcl', ['help'], __dirname, {})
  })
})
