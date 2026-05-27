import { CACHE_KEYS } from '../../../src/utils/constants'
import { getCacheEntry, setCacheEntry } from '../../../src/utils/storage'

describe('storage helpers', () => {
  it('stores and retrieves cache entries', () => {
    setCacheEntry(CACHE_KEYS.airlines, [{ id: '1', name: 'Latam' }], 1000)

    expect(getCacheEntry(CACHE_KEYS.airlines)?.data).toEqual([{ id: '1', name: 'Latam' }])
  })
})
