import { screen } from '@testing-library/react'

import LoadingSpinner from '../../../../src/components/common/LoadingSpinner'
import { renderWithProviders } from '../../testUtils'

describe('LoadingSpinner', () => {
  it('renders the provided label', () => {
    renderWithProviders(<LoadingSpinner label="Loading airlines..." />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading airlines...')
  })
})
