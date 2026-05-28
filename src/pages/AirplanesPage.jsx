import { useState } from 'react'
import styled from 'styled-components'

import AirplaneCard from '../components/airplanes/AirplaneCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatusBanner from '../components/common/StatusBanner'
import AirplaneForm from '../components/forms/AirplaneForm'
import { useAirplanes } from '../hooks/useAirplanes'
import { CardList, SectionCard, SectionGrid } from '../styles/layout'

const Heading = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  h2,
  p {
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(20, 33, 61, 0.45);
  z-index: 10;
`

const ModalCard = styled.div`
  width: min(100%, 28rem);
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};

  h4,
  p {
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`

const SecondaryButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.8rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`

const DangerButton = styled.button`
  border: 0;
  padding: 0.8rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.danger};
  color: #fff;
  font-weight: 600;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

/**
 * Renders the airplanes management experience for the standalone airplane payload.
 */
function AirplanesPage() {
  const { items, loading, error, warning, submitting, createAirplane, removeAirplane } = useAirplanes()
  const [successMessage, setSuccessMessage] = useState('')
  const [airplanePendingDelete, setAirplanePendingDelete] = useState(null)
  const safeItems = items?.filter(Boolean)

  const handleCreateAirplane = async payload => {
    await createAirplane(payload)
    setSuccessMessage('Airplane created successfully.')
  }

  const handleRequestDeleteAirplane = airplane => {
    setAirplanePendingDelete(airplane)
  }

  const handleCancelDeleteAirplane = () => {
    if (submitting) {
      return
    }

    setAirplanePendingDelete(null)
  }

  const handleConfirmDeleteAirplane = async () => {
    if (!airplanePendingDelete) {
      return
    }

    const airplaneId = airplanePendingDelete.oid || airplanePendingDelete.id

    await removeAirplane(airplaneId)
    setSuccessMessage('Airplane deleted successfully.')
    setAirplanePendingDelete(null)
  }

  return (
    <div>
      <Heading>
        <h2>Airplanes</h2>
        <p>Create airplanes and keep airline association available even during API outages.</p>
      </Heading>

      <SectionGrid>
        <SectionCard>
          <h3>Create airplane</h3>
          <StatusBanner type="success" message={successMessage} />
          <StatusBanner type="error" message={error} />
          <StatusBanner type="warning" message={warning} />
          <AirplaneForm onSubmit={handleCreateAirplane} isSubmitting={submitting} />
        </SectionCard>

        <SectionCard>
          <h3>Registered airplanes</h3>
          {loading ? <LoadingSpinner fullScreen label="Loading airplanes..." /> : null}
          {!loading && safeItems.length === 0 ? <p>No airplanes available.</p> : null}
          {!loading ? (
            <CardList>
              {safeItems.map(airplane => (
                <AirplaneCard
                  key={airplane.oid || airplane.id || `${airplane.model}-${airplane.prefix}`}
                  airplane={airplane}
                  onDelete={() => handleRequestDeleteAirplane(airplane)}
                  isDeleting={submitting}
                />
              ))}
            </CardList>
          ) : null}
        </SectionCard>
      </SectionGrid>

      {airplanePendingDelete ? (
        <ModalOverlay role="presentation">
          <ModalCard role="dialog" aria-modal="true" aria-labelledby="delete-airplane-title">
            <h4 id="delete-airplane-title">Delete airplane</h4>
            <p>
              Do you want to delete the airplane <strong>{airplanePendingDelete.model}</strong>?
            </p>
            <ModalActions>
              <SecondaryButton type="button" onClick={handleCancelDeleteAirplane} disabled={submitting}>
                Cancel
              </SecondaryButton>
              <DangerButton type="button" onClick={handleConfirmDeleteAirplane} disabled={submitting}>
                {submitting ? 'Deleting...' : 'Confirm delete'}
              </DangerButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      ) : null}
    </div>
  )
}

export default AirplanesPage
