import styled from 'styled-components'

const toneMap = {
  error: {
    background: '#fee2e2',
    color: '#991b1b'
  },
  warning: {
    background: '#ffedd5',
    color: '#9a3412'
  },
  success: {
    background: '#dcfce7',
    color: '#166534'
  }
}

const Banner = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $type }) => toneMap[$type]?.background ?? toneMap.success.background};
  color: ${({ $type }) => toneMap[$type]?.color ?? toneMap.success.color};
`

function StatusBanner({ type = 'success', message }) {
  if (!message) {
    return null
  }

  return (
    <Banner $type={type} role={type === 'error' ? 'alert' : 'status'}>
      {message}
    </Banner>
  )
}

export default StatusBanner
