import React from 'react'
import styled from 'styled-components'
import { FiAlertTriangle } from 'react-icons/fi'

const Wrapper = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`

/**
 * Wraps a feature subtree and renders a safe fallback when rendering fails.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Wrapper role="alert">
          <FiAlertTriangle size={28} />
          <h2>{this.props.featureName} is temporarily unavailable.</h2>
          <p>Please refresh the page or try again in a few moments.</p>
        </Wrapper>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
