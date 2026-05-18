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

  useEffect(() => {
    dispatch(fetchAirlines())
  }, [dispatch])

  return {
    ...airlinesState,
    refreshAirlines: () => dispatch(fetchAirlines()),
    createAirline: payload => dispatch(createAirline(payload)).unwrap(),
    clearError: () => dispatch(clearAirlinesError()),
    clearWarning: () => dispatch(clearAirlinesWarning())
  }
}
