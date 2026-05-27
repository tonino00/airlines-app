import { airplanesMock } from '../mocks/airplanes'
import { USE_MOCK } from '../utils/constants'

import { httpClient } from './httpClient'

/**
 * Retrieves airplanes from the configured backend or mock source.
 * @returns {Promise<{ ok: boolean, data: Array }>} 
 */
export async function getAirplanes() {
  if (USE_MOCK) {
    return { ok: true, data: airplanesMock }
  }

  const response = await httpClient.get('/airplanes')
  return response.data
}

/**
 * Persists a new airplane through the backend or local mock pipeline.
 * @param {{ model: string, manufacturer: string, capacity: number, prefix: string, status: string, airlineId: string }} payload
 * @returns {Promise<{ ok: boolean, data: object }>}
 */
export async function postAirplane(payload) {
  if (USE_MOCK) {
    return {
      ok: true,
      data: {
        id: crypto.randomUUID(),
        ...payload
      }
    }
  }

  const response = await httpClient.post('/airplanes', payload)
  return response.data
}
