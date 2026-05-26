import { useReveal } from '../hooks/useReveal'
import styles from './Efficiency.module.css'

export default function Efficiency({ players }) {
  const ref = useReveal(0.1)

  const valid = players.filter(p => p.stats?.shotsFired > 0 && p.stats?.kills > 0)
  if (valid.length === 0) return null

  // Balas por baja (menos = mejor)
  const rows = valid
    .map(p => ({
      ...p,
      bpk: Math.round(p.stats.shotsFired / p.stats.kills),
      hpk: Math.round((p.stats.shotsHit || 0) / p.stats.kills),
    }))
    .sort((a, b) => a.bpk - b.bpk)

  const maxBpk = rows[rows.length - 1]?.bpk || 1

  return (
    <section className={`section ${styles.eff}`} id="efficiency">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>EFICIENCIA</h2>
          <p className={styles.sub}>Balas necesarias por baja — menos es mejor</p>
        </header>

        <div className={`reveal ${styles.list}`} ref={ref}>
          {rows.map((p, i) => {
            const isFirst = i === 0
            return (
              <div key={p.steamId} className={`${styles.row} ${isFirst ? styles.rowFirst : ''}`}>
                {/* Rank */}
                <div className={styles.rank} style={{ color: isFirst ? '#fbbf24' : 'var(--text-dim)' }}>
                  {isFirst ? '★' : `#${i + 1}`}
                </div>

                {/* Nombre */}
                <div className={styles.name} style={{ color: p.color }}>{p.displayName}</div>

                {/* Barra horizontal */}
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${(p.bpk / maxBpk) * 100}%`,
                      background: p.color,
                      opacity: isFirst ? 1 : 0.5,
                    }}
                  />
                </div>

                {/* Valores */}
                <div className={styles.vals}>
                  <span className={styles.bpk}>{p.bpk}</span>
                  <span className={styles.bpkLabel}>balas/baja</span>
                </div>

                <div className={styles.extra}>
                  <span className={styles.extraVal}>{p.stats.shotsFired.toLocaleString('es-AR')}</span>
                  <span className={styles.extraLab}>disparos</span>
                </div>

                <div className={styles.extra}>
                  <span className={styles.extraVal}>{p.stats.accuracy}%</span>
                  <span className={styles.extraLab}>precisión</span>
                </div>
              </div>
            )
          })}
        </div>

        <p className={styles.footnote}>
          Stats históricas CS:GO + CS2 acumuladas — Limitación de la API de Valve
        </p>
      </div>
    </section>
  )
}
