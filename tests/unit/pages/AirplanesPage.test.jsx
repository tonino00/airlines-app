import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
      createAirplane: vi.fn(),
      removeAirplane: vi.fn()
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
      createAirplane: vi.fn(),
      removeAirplane: vi.fn()
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
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('calls removeAirplane when the delete button is clicked', async () => {
    const user = userEvent.setup()
    const removeAirplane = vi.fn().mockResolvedValue(undefined)

    useAirplanes.mockReturnValue({
      items: [{ oid: 'plane-oid-1', model: 'A320', airlineId: '1', capacity: 180 }],
      loading: false,
      submitting: false,
      error: null,
      warning: null,
      createAirplane: vi.fn(),
      removeAirplane
    })

    renderWithProviders(<AirplanesPage />)

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/do you want to delete the airplane/i)).toBeInTheDocument()
    expect(removeAirplane).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /confirm delete/i }))

    await waitFor(() => {
      expect(removeAirplane).toHaveBeenCalledWith('plane-oid-1')
    })
    expect(screen.getByText('Airplane deleted successfully.')).toBeInTheDocument()
  })

  it('closes the confirmation modal without deleting when the user cancels', async () => {
    const user = userEvent.setup()
    const removeAirplane = vi.fn().mockResolvedValue(undefined)

    useAirplanes.mockReturnValue({
      items: [{ oid: 'plane-oid-1', model: 'A320', airlineId: '1', capacity: 180 }],
      loading: false,
      submitting: false,
      error: null,
      warning: null,
      createAirplane: vi.fn(),
      removeAirplane
    })

    renderWithProviders(<AirplanesPage />)

    await user.click(screen.getByRole('button', { name: /delete/i }))
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(removeAirplane).not.toHaveBeenCalled()
  })
})
