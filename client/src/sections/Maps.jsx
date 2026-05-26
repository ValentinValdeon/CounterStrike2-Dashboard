import { useReveal } from '../hooks/useReveal'
import styles from './Maps.module.css'

const MAP_LABELS = {
  de_dust2:   'Dust II',
  de_inferno: 'Inferno',
  de_nuke:    'Nuke',
  de_vertigo: 'Vertigo',
  de_train:   'Train',
}

export default function Maps({ players }) {
  const ref = useReveal(0.05)

  const valid = players.filter(p => p.stats && p.stats.maps && Object.keys(p.stats.maps).length > 0)
  
  if (valid.length === 0) {
    return (
      <section className={`section ${styles.maps}`} id="maps">
        <div className={styles.inner}>
          <header className={styles.header}>
            <h2 className={styles.title}>MAPAS</h2>
            <p className={styles.sub}>Rondas por mapa</p>
          </header>
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: '0.9rem' }}>
            No hay datos de mapas disponibles<br/>
            (Perfiles privados o sin stats de mapas)
          </div>
        </div>
      </section>
    )
  }

  const mapKeys = Object.keys(MAP_LABELS)

  return (
    <section className={`section ${styles.maps}`} id="maps">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>MAPAS</h2>
          <p className={styles.sub}>Rondas por mapa</p>
        </header>

        <div className={`reveal ${styles.grid}`} ref={ref}>
          {mapKeys.map(mapKey => (
            <MapCard
              key={mapKey}
              mapKey={mapKey}
              label={MAP_LABELS[mapKey]}
              players={valid}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function MapCard({ mapKey, label, players }) {
  const totals = players.reduce((acc, p) => {
    const m = p.stats?.maps?.[mapKey]
    if (!m) return acc
    acc.wins += m.roundsWon || 0
    acc.rounds += m.roundsPlayed || 0
    return acc
  }, { wins: 0, rounds: 0 })

  return (
    <article className={styles.card}>
      <span className={`${styles.corner} ${styles.cornerTL}`} />
      <span className={`${styles.corner} ${styles.cornerTR}`} />
      <span className={`${styles.corner} ${styles.cornerBL}`} />
      <span className={`${styles.corner} ${styles.cornerBR}`} />

      <div className={styles.topBar} />
      <div className={styles.scanlines} />
      <span className={`${styles.dot} ${styles.dotL}`} />
      <span className={styles.dot} />

      <div className={styles.cardHeader}>
        <span className={styles.mapName}>{label}</span>
        <span className={styles.mapWr}>{totals.wins.toLocaleString('es-AR')}</span>
      </div>

      <p className={styles.mapSub}>
        <span>{totals.wins.toLocaleString('es-AR')} / {totals.rounds.toLocaleString('es-AR')} rnd</span>
        <span className={styles.mapSubLabel}>wins/total</span>
      </p>

      <div className={styles.statsRows}>
        {players.map(p => {
          const m = p.stats?.maps?.[mapKey]
          const wins = m?.roundsWon || 0
          const rounds = m?.roundsPlayed || 0
          return (
            <div key={p.steamId} className={styles.statRow}>
              <span className={styles.playerName} style={{ color: p.color }}>{p.displayName}</span>
              <span className={styles.playerStats}>{wins.toLocaleString('es-AR')}/{rounds.toLocaleString('es-AR')}</span>
            </div>
          )
        })}
      </div>
    </article>
  )
}