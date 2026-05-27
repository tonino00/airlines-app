import { screen } from '@testing-library/react'

vi.mock('../../../src/hooks/useAirlines', () => ({
  useAirlines: vi.fn()
}))

import AirlinesPage from '../../../src/pages/AirlinesPage'
import { useAirlines } from '../../../src/hooks/useAirlines'
import { renderWithProviders } from '../testUtils'

describe('AirlinesPage', () => {
  it('renders loading state', () => {
    useAirlines.mockReturnValue({
      items: [],
      loading: true,
      submitting: false,
      error: null,
      warning: null,
      createAirline: vi.fn()
    })

    renderWithProviders(<AirlinesPage />)

    expect(screen.getByText(/loading airlines/i)).toBeInTheDocument()
  })

  it('renders list items and feedback banners', () => {
    useAirlines.mockReturnValue({
      items: [{ id: '1', name: 'Latam', code: 'LA', country: 'Brazil' }],
      loading: false,
      submitting: false,
      error: 'API failed',
      warning: 'Showing cached airlines because the API is unavailable.',
      createAirline: vi.fn()
    })

    renderWithProviders(<AirlinesPage />)

    expect(screen.getByText('Latam')).toBeInTheDocument()
    expect(screen.getByText('API failed')).toBeInTheDocument()
    expect(screen.getByText(/Showing cached airlines/i)).toBeInTheDocument()
  })
})
