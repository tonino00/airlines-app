import { CACHE_TTL_MS } from './constants'

const hasStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

/**
 * Persists cached resource data using a TTL-aware envelope.
 * @param {string} key
 * @param {unknown} data
 * @param {number} ttl
 */
export function setCacheEntry(key, data, ttl = CACHE_TTL_MS) {
  if (!hasStorage()) {
    return
  }

  const payload = {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttl
  }

  window.localStorage.setItem(key, JSON.stringify(payload))
}

/**
 * Reads cached resource data and returns metadata for fallback decisions.
 * @param {string} key
 * @returns {{ data: unknown, isStale: boolean, timestamp: number | null } | null}
 */
export function getCacheEntry(key) {
  if (!hasStorage()) {
    return null
  }

  const rawValue = window.localStorage.getItem(key)

  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue)
    const isStale = parsedValue.expiresAt < Date.now()

    return {
      data: parsedValue.data,
      isStale,
      timestamp: parsedValue.timestamp ?? null
    }
  } catch (error) {
    console.warn('Failed to parse cache entry', error)
    window.localStorage.removeItem(key)
    return null
  }
}

export function removeCacheEntry(key) {
  if (!hasStorage()) {
    return
  }

  window.localStorage.removeItem(key)
}
