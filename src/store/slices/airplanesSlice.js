import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { deleteAirplaneById, getAirplanes, postAirplane } from '../../api/airplanesApi'
import { CACHE_KEYS } from '../../utils/constants'
import { getUserFriendlyError } from '../../utils/errorHandling'
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
    return response.filter(Boolean)
  }

  if (Array.isArray(response?.data)) {
    return response.data.filter(Boolean)
  }

  return []
}

const normalizeEntityResponse = response => {
  if (response?.data && !Array.isArray(response.data)) {
    return response.data
  }

  return response ?? null
}

/**
 * Loads airplanes with cache fallback when the upstream service fails.
 * @returns {Promise<object>}
 */
export const fetchAirplanes = createAsyncThunk(
  'airplanes/fetchAirplanes',
  async (_, { rejectWithValue }) => {
    const cacheEntry = getCacheEntry(CACHE_KEYS.airplanes)

    try {
      const response = await getAirplanes()
      const items = normalizeCollectionResponse(response)

      setCacheEntry(CACHE_KEYS.airplanes, items)

      return {
        items,
        warning: cacheEntry?.isStale ? 'Fresh airplane data loaded after cache revalidation.' : null,
        isFallback: false,
        lastFetched: Date.now()
      }
    } catch (error) {
      if (cacheEntry?.data) {
        return {
          items: cacheEntry.data,
          warning: 'Showing cached airplanes because the API is unavailable.',
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
 * Creates a new airplane and updates cache-backed UI state.
 * @param {{ model: string, airlineId: string, capacity: number }} payload
 * @returns {Promise<object>}
 */
export const createAirplane = createAsyncThunk(
  'airplanes/createAirplane',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postAirplane(payload)
      return normalizeEntityResponse(response)
    } catch (error) {
      return rejectWithValue({
        message: getUserFriendlyError(error)
      })
    }
  }
)

/**
 * Deletes an airplane and keeps cache-backed UI state in sync.
 * @param {string} airplaneId
 * @returns {Promise<string>}
 */
export const removeAirplane = createAsyncThunk(
  'airplanes/removeAirplane',
  async (airplaneId, { rejectWithValue }) => {
    try {
      await deleteAirplaneById(airplaneId)
      return airplaneId
    } catch (error) {
      return rejectWithValue({
        message: getUserFriendlyError(error)
      })
    }
  }
)

const airplanesSlice = createSlice({
  name: 'airplanes',
  initialState,
  reducers: {
    clearAirplanesError: state => {
      state.error = null
    },
    clearAirplanesWarning: state => {
      state.warning = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAirplanes.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAirplanes.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.warning = action.payload.warning
        state.isFallback = action.payload.isFallback
        state.lastFetched = action.payload.lastFetched
      })
      .addCase(fetchAirplanes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message ?? 'Failed to load airplanes.'
      })
      .addCase(createAirplane.pending, state => {
        state.submitting = true
        state.error = null
      })
      .addCase(createAirplane.fulfilled, (state, action) => {
        state.submitting = false
        state.items = [action.payload, ...state.items].filter(Boolean)
        state.warning = null
        setCacheEntry(CACHE_KEYS.airplanes, state.items)
      })
      .addCase(createAirplane.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload?.message ?? 'Failed to create airplane.'
      })
      .addCase(removeAirplane.pending, state => {
        state.submitting = true
        state.error = null
      })
      .addCase(removeAirplane.fulfilled, (state, action) => {
        state.submitting = false
        state.items = state.items.filter(airplane => {
          const airplaneId = airplane?.oid || airplane?.id
          return airplaneId !== action.payload
        })
        state.warning = null
        setCacheEntry(CACHE_KEYS.airplanes, state.items)
      })
      .addCase(removeAirplane.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload?.message ?? 'Failed to delete airplane.'
      })
  }
})

export const { clearAirplanesError, clearAirplanesWarning } = airplanesSlice.actions
export default airplanesSlice.reducer
