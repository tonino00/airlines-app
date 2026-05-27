import { airlinesMock } from '../mocks/airlines'
import { USE_MOCK } from '../utils/constants'

import { httpClient } from './httpClient'

/**
 * Retrieves airlines from the configured backend or mock source.
 * @returns {Promise<{ ok: boolean, data: Array }>} 
 */
export async function getAirlines() {
  if (USE_MOCK) {
    return { ok: true, data: airlinesMock }
  }

  const response = await httpClient.get('/airlines')
  return response.data
}

/**
 * Persists a new airline through the backend or local mock pipeline.
 * @param {{ name: string, hub: string }} payload
 * @returns {Promise<{ ok: boolean, data: object }>}
 */
export async function postAirline(payload) {
  if (USE_MOCK) {
    return {
      ok: true,
      data: {
        id: crypto.randomUUID(),
        ...payload
      }
    }
  }

  const response = await httpClient.post('/airlines', payload)
  return response.data
}
