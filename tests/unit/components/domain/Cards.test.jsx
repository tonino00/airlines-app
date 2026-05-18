import { screen } from '@testing-library/react'

import AirlineCard from '../../../../src/components/airlines/AirlineCard'
import AirplaneCard from '../../../../src/components/airplanes/AirplaneCard'
import { renderWithProviders } from '../../testUtils'

describe('domain cards', () => {
  it('renders airline details', () => {
    renderWithProviders(<AirlineCard airline={{ name: 'Latam', hub: 'São Paulo' }} />)

    expect(screen.getByText('Latam')).toBeInTheDocument()
    expect(screen.getByText(/São Paulo/)).toBeInTheDocument()
  })

  it('renders airplane details', () => {
    renderWithProviders(
      <AirplaneCard airplane={{ model: 'A320', manufacturer: 'Airbus', capacity: 180, prefix: 'PT-XYZ', status: 'active' }} airlineName="Latam" />
    )

    expect(screen.getByText('A320')).toBeInTheDocument()
    expect(screen.getByText('Airbus')).toBeInTheDocument()
    expect(screen.getByText(/180 seats/)).toBeInTheDocument()
  })
})
