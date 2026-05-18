export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://airline-manager-23mn.onrender.com'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
export const REQUEST_TIMEOUT_MS = 10000
export const MAX_RETRIES = 3
export const CACHE_TTL_MS = 5 * 60 * 1000
export const RETRY_DELAYS_MS = [500, 1000, 2000]
export const CACHE_KEYS = {
  airlines: 'airlines-app:airlines',
  airplanes: 'airlines-app:airplanes'
}
