import styled from 'styled-components'
import { FiFlag } from 'react-icons/fi'

const Card = styled.li`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
`

function AirlineCard({ airline }) {
  return (
    <Card>
      <strong>{airline.name}</strong>
      <Meta>
        <span>
          <FiFlag aria-hidden="true" /> {airline.hub || 'Hub unavailable'}
        </span>
      </Meta>
    </Card>
  )
}

export default AirlineCard
