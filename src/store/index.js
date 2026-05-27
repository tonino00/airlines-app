import { configureStore } from '@reduxjs/toolkit'

import airplanesReducer from './slices/airplanesSlice'
import airlinesReducer from './slices/airlinesSlice'

export const store = configureStore({
  reducer: {
    airlines: airlinesReducer,
    airplanes: airplanesReducer
  }
})
