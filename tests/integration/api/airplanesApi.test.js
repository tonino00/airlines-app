import { getUserFriendlyError } from '../../../src/utils/errorHandling'

describe('error handling', () => {
  it('returns user-friendly message for timeout errors', () => {
    expect(getUserFriendlyError({ code: 'ECONNABORTED' })).toMatch(/too long/i)
  })

  it('returns fallback message when there is no cache available', () => {
    expect(getUserFriendlyError({}, { fallback: true, hasCache: false })).toMatch(/no cached data/i)
  })
})
