import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AirlineForm from '../../../../src/components/forms/AirlineForm'
import { renderWithProviders } from '../../testUtils'

describe('AirlineForm', () => {
  it('validates required fields before submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    renderWithProviders(<AirlineForm onSubmit={onSubmit} isSubmitting={false} />)

    await user.click(screen.getByRole('button', { name: /create airline/i }))

    expect(screen.getByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Hub is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits normalized values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    renderWithProviders(<AirlineForm onSubmit={onSubmit} isSubmitting={false} />)

    await user.type(screen.getByLabelText(/airline name/i), 'Latam')
    await user.type(screen.getByLabelText(/hub/i), 'São Paulo')
    await user.click(screen.getByRole('button', { name: /create airline/i }))

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Latam', hub: 'São Paulo' })
  })
})
