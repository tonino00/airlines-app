import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getAirlines, postAirline } from '../../api/airlinesApi'
import { getUserFriendlyError } from '../../utils/errorHandling'
import { CACHE_KEYS } from '../../utils/constants'
import { getCacheEntry, setCacheEntry } from '../../utils/storage'

const initialState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  warning: null,
  lastFetched: null,
  isFallback: false
}

const normalizeCollectionResponse = response => {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  return []
}

const normalizeEntityResponse = response => {
  if (response?.data && !Array.isArray(response.data)) {
    return response.data
  }

  return response
}

/**
 * Loads airlines with stale-while-revalidate behavior and cache fallback.
 * @returns {Promise<object>}
 */
export const fetchAirlines = createAsyncThunk(
  'airlines/fetchAirlines',
  async (_, { rejectWithValue }) => {
    const cacheEntry = getCacheEntry(CACHE_KEYS.airlines)

    try {
      const response = await getAirlines()
      const items = normalizeCollectionResponse(response)

      setCacheEntry(CACHE_KEYS.airlines, items)

      return {
        items,
        warning: cacheEntry?.isStale ? 'Fresh data loaded after validating cached content.' : null,
        isFallback: false,
        lastFetched: Date.now()
      }
    } catch (error) {
      if (cacheEntry?.data) {
        return {
          items: cacheEntry.data,
          warning: 'Showing cached airlines because the API is unavailable.',
          isFallback: true,
          lastFetched: cacheEntry.timestamp
        }
      }

      return rejectWithValue({
        message: getUserFriendlyError(error, { fallback: true, hasCache: false })
      })
    }
  }
)

/**
 * Creates a new airline and refreshes local cache-compatible state.
 * @param {{ name: string, code: string, country?: string }} payload
 * @returns {Promise<object>}
 */
export const createAirline = createAsyncThunk(
  'airlines/createAirline',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postAirline(payload)
      return normalizeEntityResponse(response)
    } catch (error) {
      return rejectWithValue({
        message: getUserFriendlyError(error)
      })
    }
  }
)

const airlinesSlice = createSlice({
  name: 'airlines',
  initialState,
  reducers: {
    clearAirlinesError: state => {
      state.error = null
    },
    clearAirlinesWarning: state => {
      state.warning = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAirlines.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAirlines.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.warning = action.payload.warning
        state.isFallback = action.payload.isFallback
        state.lastFetched = action.payload.lastFetched
      })
      .addCase(fetchAirlines.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message ?? 'Failed to load airlines.'
      })
      .addCase(createAirline.pending, state => {
        state.submitting = true
        state.error = null
      })
      .addCase(createAirline.fulfilled, (state, action) => {
        state.submitting = false
        state.items = [action.payload, ...state.items]
        state.warning = null
        setCacheEntry(CACHE_KEYS.airlines, state.items)
      })
      .addCase(createAirline.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload?.message ?? 'Failed to create airline.'
      })
  }
})

export const { clearAirlinesError, clearAirlinesWarning } = airlinesSlice.actions
export default airlinesSlice.reducer
