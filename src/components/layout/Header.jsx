import styled from 'styled-components'
import { FiHash, FiSend } from 'react-icons/fi'

const Wrapper = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Content = styled.div`
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }
`

const Heading = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};

  h1,
  p {
    margin: 0;
  }

  h1 {
    font-family: ${({ theme }) => theme.fonts.heading};
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.8rem 1rem;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.surfaceAlt)};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.text)};
`

function Header({ currentPage, onNavigate }) {
  return (
    <Wrapper>
      <Content>
        <Heading>
          <h1>Airlines Manager</h1>
          <p>Manage airlines and airplanes with resilient API workflows.</p>
        </Heading>
        <Nav aria-label="Primary navigation">
          <NavButton
            type="button"
            $active={currentPage === 'airlines'}
            onClick={() => onNavigate('airlines')}
          >
            <FiSend />
            Airlines
          </NavButton>
          <NavButton
            type="button"
            $active={currentPage === 'airplanes'}
            onClick={() => onNavigate('airplanes')}
          >
            <FiHash />
            Airplanes
          </NavButton>
        </Nav>
      </Content>
    </Wrapper>
  )
}

export default Header
