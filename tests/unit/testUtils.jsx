import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import airplanesReducer from '../../src/store/slices/airplanesSlice'
import airlinesReducer from '../../src/store/slices/airlinesSlice'
import { theme } from '../../src/styles/theme'

export function createTestStore(preloadedState) {
  return configureStore({
    reducer: {
      airlines: airlinesReducer,
      airplanes: airplanesReducer
    },
    preloadedState
  })
}

export function renderWithProviders(ui, { preloadedState, store = createTestStore(preloadedState) } = {}) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </Provider>
    )
  }
}
