import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  clearAirplanesError,
  clearAirplanesWarning,
  createAirplane,
  fetchAirplanes
} from '../store/slices/airplanesSlice'

/**
 * Connects airplanes UI state to the Redux store and feature thunks.
 * @returns {object}
 */
export function useAirplanes() {
  const dispatch = useDispatch()
  const airplanesState = useSelector(state => state.airplanes)

  useEffect(() => {
    dispatch(fetchAirplanes())
  }, [dispatch])

  return {
    ...airplanesState,
    refreshAirplanes: () => dispatch(fetchAirplanes()),
    createAirplane: payload => dispatch(createAirplane(payload)).unwrap(),
    clearError: () => dispatch(clearAirplanesError()),
    clearWarning: () => dispatch(clearAirplanesWarning())
  }
}
