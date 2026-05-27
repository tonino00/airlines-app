const NETWORK_ERROR_MESSAGE = 'Unable to reach the service right now. Please try again in a moment.'
const TIMEOUT_ERROR_MESSAGE = 'The request took too long to complete. Please try again.'
const FALLBACK_ERROR_MESSAGE = 'The service is temporarily unavailable and no cached data could be loaded.'

/**
 * Normalizes API and validation errors into user-friendly UI messages.
 * @param {unknown} error
 * @param {{ hasCache?: boolean, fallback?: boolean }} options
 * @returns {string}
 */
export function getUserFriendlyError(error, options = {}) {
  if (error?.validationMessage) {
    return error.validationMessage
  }

  if (options.fallback && !options.hasCache) {
    return FALLBACK_ERROR_MESSAGE
  }

  if (error?.code === 'ECONNABORTED') {
    return TIMEOUT_ERROR_MESSAGE
  }

  if (!error?.response) {
    return NETWORK_ERROR_MESSAGE
  }

  if (error.response.status === 503) {
    return 'The API is temporarily unavailable. Showing cached data when possible.'
  }

  if (error.response.status >= 500) {
    return 'The server failed to process the request. Please try again shortly.'
  }

  if (error.response.status >= 400) {
    return 'The submitted data could not be processed. Please review the form fields.'
  }

  return NETWORK_ERROR_MESSAGE
}
