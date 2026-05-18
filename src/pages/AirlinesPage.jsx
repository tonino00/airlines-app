import { useState } from 'react'
import styled from 'styled-components'

import AirlineCard from '../components/airlines/AirlineCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatusBanner from '../components/common/StatusBanner'
import AirlineForm from '../components/forms/AirlineForm'
import { useAirlines } from '../hooks/useAirlines'
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
 * Renders the airlines management experience with resilient loading and creation flows.
 */
function AirlinesPage() {
  const { items, loading, error, warning, submitting, createAirline, refreshAirlines } = useAirlines()
  const [successMessage, setSuccessMessage] = useState('')

  const handleCreateAirline = async payload => {
    await createAirline(payload)
    await refreshAirlines()
    setSuccessMessage('Airline created successfully.')
  }

  return (
    <div>
      <Heading>
        <h2>Airlines</h2>
        <p>Manage airline records with cache-backed fallback when the API is offline.</p>
      </Heading>

      <SectionGrid>
        <SectionCard>
          <h3>Create airline</h3>
          <StatusBanner type="success" message={successMessage} />
          <StatusBanner type="error" message={error} />
          <StatusBanner type="warning" message={warning} />
          <AirlineForm onSubmit={handleCreateAirline} isSubmitting={submitting} />
        </SectionCard>

        <SectionCard>
          <h3>Registered airlines</h3>
          {loading ? <LoadingSpinner fullScreen label="Loading airlines..." /> : null}
          {!loading && items.length === 0 ? <p>No airlines available.</p> : null}
          {!loading ? (
            <CardList>
              {items.map(airline => (
                <AirlineCard key={airline.oid || airline.id || airline.name} airline={airline} />
              ))}
            </CardList>
          ) : null}
        </SectionCard>
      </SectionGrid>
    </div>
  )
}

export default AirlinesPage
