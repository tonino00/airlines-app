import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  clearAirlinesError,
  clearAirlinesWarning,
  createAirline,
  fetchAirlines
} from '../store/slices/airlinesSlice'

/**
 * Connects airlines UI state to the Redux store and feature thunks.
 * @returns {object}
 */
export function useAirlines() {
  const dispatch = useDispatch()
  const airlinesState = useSelector(state => state.airlines)
  const { items, loading, lastFetched } = airlinesState

  useEffect(() => {
    if (loading || items.length > 0 || lastFetched) {
      return
    }

    dispatch(fetchAirlines())
  }, [dispatch, items.length, lastFetched, loading])

  return {
    ...airlinesState,
    refreshAirlines: () => dispatch(fetchAirlines()),
    createAirline: payload => dispatch(createAirline(payload)).unwrap(),
    clearError: () => dispatch(clearAirlinesError()),
    clearWarning: () => dispatch(clearAirlinesWarning())
  }
}
