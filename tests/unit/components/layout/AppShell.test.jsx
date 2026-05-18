import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AppShell from '../../../../src/components/layout/AppShell'
import { renderWithProviders } from '../../testUtils'

describe('AppShell', () => {
  it('renders children and delegates navigation', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()

    renderWithProviders(
      <AppShell currentPage="airlines" onNavigate={onNavigate}>
        <div>Page content</div>
      </AppShell>
    )

    expect(screen.getByText('Page content')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /airplanes/i }))

    expect(onNavigate).toHaveBeenCalledWith('airplanes')
  })
})
