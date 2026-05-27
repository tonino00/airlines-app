import styled from 'styled-components'

export const PageContainer = styled.div`
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
`

export const SectionCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.lg};
`

export const SectionGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);
    align-items: start;
  }
`

export const CardList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`
