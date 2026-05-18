import styled from 'styled-components'

const Wrapper = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

const Content = styled.div`
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.textMuted};
`

function Footer() {
  return (
    <Wrapper>
      <Content>
        Built for resilient airline operations management.
      </Content>
    </Wrapper>
  )
}

export default Footer
