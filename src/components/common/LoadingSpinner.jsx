import styled, { css, keyframes } from 'styled-components'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};

  ${({ $fullScreen }) =>
    $fullScreen &&
    css`
      min-height: 40vh;
      width: 100%;
    `}
`

const SpinnerCircle = styled.span`
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border: 4px solid ${({ theme }) => theme.colors.surfaceAlt};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
`

/**
 * Displays a reusable loading indicator for async UI states.
 * @param {{ size?: string, label?: string, fullScreen?: boolean }} props
 */
function LoadingSpinner({ size = '2rem', label = 'Loading...', fullScreen = false }) {
  return (
    <Wrapper $fullScreen={fullScreen} role="status" aria-live="polite">
      <SpinnerCircle $size={size} aria-hidden="true" />
      <span>{label}</span>
    </Wrapper>
  )
}

export default LoadingSpinner
