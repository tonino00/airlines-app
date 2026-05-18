import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import ErrorBoundary from '../../../../src/components/common/ErrorBoundary'
import { theme } from '../../../../src/styles/theme'

function BuggyComponent() {
  throw new Error('Boom')
}

describe('ErrorBoundary', () => {
  it('renders fallback UI when a child crashes', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ThemeProvider theme={theme}>
        <ErrorBoundary featureName="Airlines">
          <BuggyComponent />
        </ErrorBoundary>
      </ThemeProvider>
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Airlines is temporarily unavailable.')

    spy.mockRestore()
  })
})
