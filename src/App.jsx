import { useMemo, useState } from 'react'

import ErrorBoundary from './components/common/ErrorBoundary'
import AppShell from './components/layout/AppShell'
import AirlinesPage from './pages/AirlinesPage'
import AirplanesPage from './pages/AirplanesPage'

function App() {
  const [currentPage, setCurrentPage] = useState('airlines')

  const pageContent = useMemo(() => {
    if (currentPage === 'airplanes') {
      return (
        <ErrorBoundary featureName="Airplanes">
          <AirplanesPage />
        </ErrorBoundary>
      )
    }

    return (
      <ErrorBoundary featureName="Airlines">
        <AirlinesPage />
      </ErrorBoundary>
    )
  }, [currentPage])

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
      {pageContent}
    </AppShell>
  )
}

export default App
