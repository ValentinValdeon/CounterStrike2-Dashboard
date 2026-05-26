import './index.css'
import { StatsProvider, useStats } from './context/StatsContext'
import LoadingScreen from './components/LoadingScreen'
import ErrorScreen from './components/ErrorScreen'
import LegendButton from './components/Legend'
import Hero from './sections/Hero'
import Players from './sections/Players'
import Podium from './sections/Podium'
import Compare from './sections/Compare'
import Weapons from './sections/Weapons'
import Maps from './sections/Maps'
import Efficiency from './sections/Efficiency'
import Medals from './sections/Medals'

function AppContent() {
  const { loading, error, players, refetch, lastFetch } = useStats()

  if (loading) return <LoadingScreen />
  if (error)   return <ErrorScreen message={error} onRetry={refetch} />

  return (
    <main>
      <LegendButton />
      <Hero players={players} lastFetch={lastFetch} />
      <div className="section-divider" />
      <Players players={players} />
      <div className="section-divider" />
      <Medals players={players} />
      <div className="section-divider" />
      <Podium players={players} />
      <div className="section-divider" />
      <Compare players={players} />
      <div className="section-divider" />
      <Weapons players={players} />
      <div className="section-divider" />
      <Maps players={players} />
      <div className="section-divider" />
      <Efficiency players={players} />
      <footer style={{
        textAlign: 'center',
        padding: '3rem',
        fontFamily: 'var(--mono)',
        fontSize: '0.65rem',
        color: 'var(--text-dim)',
        letterSpacing: '0.1em',
        position: 'relative',
        zIndex: 1
      }}>
        CS2 STATS · GRUPO DE AMIGOS · STEAM WEB API
      </footer>
    </main>
  )
}

export default function App() {
  return (
    <StatsProvider>
      <AppContent />
    </StatsProvider>
  )
}
