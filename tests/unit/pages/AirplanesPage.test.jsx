import { screen } from '@testing-library/react'

vi.mock('../../../src/hooks/useAirplanes', () => ({
  useAirplanes: vi.fn()
}))

import AirplanesPage from '../../../src/pages/AirplanesPage'
import { useAirplanes } from '../../../src/hooks/useAirplanes'
import { renderWithProviders } from '../testUtils'

describe('AirplanesPage', () => {
  it('renders empty state when no airplanes are available', () => {
    useAirplanes.mockReturnValue({
      items: [],
      loading: false,
      submitting: false,
      error: null,
      warning: null,
      createAirplane: vi.fn()
    })

    renderWithProviders(<AirplanesPage />, {
      preloadedState: {
        airlines: {
          items: [{ id: '1', name: 'Latam', code: 'LA', country: 'Brazil' }],
          loading: false,
          submitting: false,
          error: null,
          warning: null,
          lastFetched: null,
          isFallback: false
        },
        airplanes: {
          items: [],
          loading: false,
          submitting: false,
          error: null,
          warning: null,
          lastFetched: null,
          isFallback: false
        }
      }
    })

    expect(screen.getByText(/no airplanes available/i)).toBeInTheDocument()
  })

  it('renders airplane list with airline name', () => {
    useAirplanes.mockReturnValue({
      items: [{ id: 'plane-1', model: 'A320', airlineId: '1', capacity: 180 }],
      loading: false,
      submitting: false,
      error: null,
      warning: null,
      createAirplane: vi.fn()
    })

    renderWithProviders(<AirplanesPage />, {
      preloadedState: {
        airlines: {
          items: [{ id: '1', name: 'Latam', code: 'LA', country: 'Brazil' }],
          loading: false,
          submitting: false,
          error: null,
          warning: null,
          lastFetched: null,
          isFallback: false
        },
        airplanes: {
          items: [],
          loading: false,
          submitting: false,
          error: null,
          warning: null,
          lastFetched: null,
          isFallback: false
        }
      }
    })

    expect(screen.getByText('A320')).toBeInTheDocument()
    expect(screen.getAllByText('Latam').length).toBeGreaterThan(0)
  })
})
