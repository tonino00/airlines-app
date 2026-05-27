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

/**
 * Renders the airplanes management experience for the standalone airplane payload.
 */
function AirplanesPage() {
  const { items, loading, error, warning, submitting, createAirplane } = useAirplanes()
  const [successMessage, setSuccessMessage] = useState('')
  const safeItems = items?.filter(Boolean)

  const handleCreateAirplane = async payload => {
    await createAirplane(payload)
    setSuccessMessage('Airplane created successfully.')
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
                />
              ))}
            </CardList>
          ) : null}
        </SectionCard>
      </SectionGrid>
    </div>
  )
}

export default AirplanesPage
