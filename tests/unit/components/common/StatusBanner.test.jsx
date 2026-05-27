import { screen } from '@testing-library/react'

import StatusBanner from '../../../../src/components/common/StatusBanner'
import { renderWithProviders } from '../../testUtils'

describe('StatusBanner', () => {
  it('renders alert role for error banners', () => {
    renderWithProviders(<StatusBanner type="error" message="API failed" />)

    expect(screen.getByRole('alert')).toHaveTextContent('API failed')
  })
})
