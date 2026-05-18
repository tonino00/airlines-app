import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AirplaneForm from '../../../../src/components/forms/AirplaneForm'
import { renderWithProviders } from '../../testUtils'

describe('AirplaneForm', () => {
  it('validates required fields before submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    renderWithProviders(<AirplaneForm onSubmit={onSubmit} isSubmitting={false} />)

    await user.click(screen.getByRole('button', { name: /create airplane/i }))

    expect(screen.getByText('Model is required.')).toBeInTheDocument()
    expect(screen.getByText('Manufacturer is required.')).toBeInTheDocument()
    expect(screen.getByText('Capacity must be greater than zero.')).toBeInTheDocument()
    expect(screen.getByText('Prefix is required.')).toBeInTheDocument()
  })

  it('submits normalized values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    renderWithProviders(<AirplaneForm onSubmit={onSubmit} isSubmitting={false} />)

    await user.type(screen.getByLabelText(/model/i), 'Airbus A321')
    await user.type(screen.getByLabelText(/manufacturer/i), 'Airbus')
    await user.type(screen.getByLabelText(/capacity/i), '220')
    await user.type(screen.getByLabelText(/prefix/i), 'pt-xyz')
    await user.click(screen.getByRole('button', { name: /create airplane/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      model: 'Airbus A321',
      manufacturer: 'Airbus',
      capacity: 220,
      prefix: 'PT-XYZ',
      status: 'active'
    })
  })
})
