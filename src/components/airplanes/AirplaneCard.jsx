import styled from 'styled-components'
import { FiUsers } from 'react-icons/fi'

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

function AirplaneCard({ airplane }) {
  return (
    <Card>
      <strong>{airplane.model}</strong>
      <Meta>
        <span>{airplane.manufacturer || 'Unknown manufacturer'}</span>
        <span>{airplane.prefix || 'No prefix'}</span>
        <span>{airplane.status || 'unknown'}</span>
        <span>
          <FiUsers aria-hidden="true" /> {airplane.capacity} seats
        </span>
      </Meta>
    </Card>
  )
}

export default AirplaneCard
