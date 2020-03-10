import path from 'path'
import { readJson } from './readJson'

export const testFetchMock = (url: string) =>
  Promise.resolve({
    status: 200,
    json: () => readJson(path.join(__dirname, 'test_data', 'entities', 'remote.json'))
  })
