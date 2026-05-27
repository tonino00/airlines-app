import axios from 'axios'

import { API_BASE_URL, MAX_RETRIES, REQUEST_TIMEOUT_MS, RETRY_DELAYS_MS } from '../utils/constants'

const wait = delay => new Promise(resolve => {
  window.setTimeout(resolve, delay)
})

const shouldRetry = error => {
  if (!error) {
    return false
  }

  if (error.code === 'ECONNABORTED') {
    return true
  }

  if (!error.response) {
    return true
  }

  return error.response.status >= 500
}

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS
})

httpClient.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config

    if (!config) {
      return Promise.reject(error)
    }

    config.retryCount = config.retryCount ?? 0

    if (config.retryCount >= MAX_RETRIES || !shouldRetry(error)) {
      return Promise.reject(error)
    }

    const retryDelay = RETRY_DELAYS_MS[config.retryCount] ?? RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1]
    config.retryCount += 1

    await wait(retryDelay)

    return httpClient(config)
  }
)
