import styled from 'styled-components'

import Footer from './Footer'
import Header from './Header'

const Shell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
`

const Main = styled.main`
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`

/**
 * Creates the global application shell with header, content and footer.
 * @param {{ children: import('react').ReactNode, currentPage: string, onNavigate: (page: string) => void }} props
 */
function AppShell({ children, currentPage, onNavigate }) {
  return (
    <Shell>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <Main>{children}</Main>
      <Footer />
    </Shell>
  )
}

export default AppShell
