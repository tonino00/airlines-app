// ⚠️ VERSÃO LEGADO - APENAS PARA DEMONSTRAÇÃO ⚠️
// Este componente contém ANTI-PATTERNS intencionais para fins educativos.
// NÃO utilizar em produção. Ver versão correta em AirlinesPage.jsx

import { useState } from 'react'
import styled from 'styled-components'

import AirlineCard from '../components/airlines/AirlineCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatusBanner from '../components/common/StatusBanner'
import AirlineForm from '../components/forms/AirlineForm'
import { CardList, SectionCard, SectionGrid } from '../styles/layout'
import { useAirlines } from '../hooks/useAirlines'

const Heading = styled.div`
  display: grid;
  gap: ${({ theme }) => theme?.spacing?.sm || '8px'};
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '24px'};

  h2,
  p {
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme?.colors?.textMuted || '#666'};
  }
`

 /**
  * ⚠️ VERSÃO LEGADO - Componente com problemas intencionais
  */
 function AirlinesPage() {
  const { items, loading, error, warning, submitting, createAirline } = useAirlines()
  const [successMessage, setSuccessMessage] = useState('')

  const handleCreateAirline = async payload => {
    await createAirline(payload)
    setSuccessMessage('Airline created successfully.')
  }

  return (
    <div>
      <Heading>
        <h2>Airlines</h2>
        <p>Manage airline records with cache-backed fallback when the API is offline.</p>
      </Heading>

      {successMessage && (
        <StatusBanner type="success" message={successMessage} />
      )}
      <StatusBanner type="error" message={error} />
      <StatusBanner type="warning" message={warning} />

      <SectionGrid>
        <SectionCard>
          <h3>Create airline</h3>
          <AirlineForm onSubmit={handleCreateAirline} isSubmitting={submitting} />
        </SectionCard>

        <SectionCard>
          <h3>Registered airlines</h3>
          <p>Total: {items.length} airlines</p>

          {loading && (
            <LoadingSpinner label="Loading airlines..." />
          )}

          {!loading && items.length === 0 && (
            <p>No airlines available.</p>
          )}

          {!loading && items.length > 0 && (
            <CardList>
              {items.map(airline => (
                <AirlineCard key={airline.oid || airline.id || airline.name} airline={airline} />
              ))}
            </CardList>
          )}
        </SectionCard>
      </SectionGrid>
    </div>
  )
}

export default AirlinesPage