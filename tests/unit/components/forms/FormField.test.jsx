import { screen } from '@testing-library/react'

import FormField from '../../../../src/components/forms/FormField'
import { renderWithProviders } from '../../testUtils'

describe('FormField', () => {
  it('renders label, hint and error', () => {
    renderWithProviders(
      <FormField id="field-id" label="Field" hint="Helpful hint" error="Broken field">
        <input id="field-id" />
      </FormField>
    )

    expect(screen.getByText('Field')).toBeInTheDocument()
    expect(screen.getByText('Helpful hint')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Broken field')
  })
})
