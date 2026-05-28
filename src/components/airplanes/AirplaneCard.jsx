import styled from 'styled-components'
import { FiTrash2, FiUsers } from 'react-icons/fi'

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

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  padding: 0.65rem 0.9rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

/**
 * Displays airplane summary data and exposes contextual actions.
 * @param {{ airplane: object, onDelete?: (airplaneId: string) => void | Promise<void>, isDeleting?: boolean }} props
 */
function AirplaneCard({ airplane, onDelete, isDeleting = false }) {
  const airplaneId = airplane?.oid || airplane?.id

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
      {airplaneId && onDelete ? (
        <Actions>
          <DeleteButton type="button" onClick={() => onDelete(airplaneId)} disabled={isDeleting}>
            <FiTrash2 aria-hidden="true" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </DeleteButton>
        </Actions>
      ) : null}
    </Card>
  )
}

export default AirplaneCard
