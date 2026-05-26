import { useState } from 'react'
import styles from './Medals.module.css'
import { useMedals } from '../hooks/useMedals'
import { MedalIcon } from './MedalIcons'

function formatValue(id, value) {
  if (
    id === 'best_accuracy' ||
    id === 'best_hs'        ||
    id === 'best_winrate'   ||
    id === 'best_mvp_rate'
  ) return `${value}%`

  if (id.startsWith('weapon_')) return `${value}%`
  if (id === 'best_bpk')        return `${value} balas`
  if (id === 'best_adr')        return `${value} dmg`
  if (id === 'best_kd')         return value
  if (id === 'most_time')       return `${value}h`

  return (+value).toLocaleString('es-AR')
}

export default function Medals({ players }) {
  const medals = useMedals(players)
  const [flipped, setFlipped] = useState({})

  if (medals.length === 0) return null

  const toggle = (id) =>
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <section className={styles.medals}>
      <div className={styles.header}>
        <p className={styles.label}>Estadísticas · Grupo</p>
        <h2 className={styles.title}>MEDALLAS</h2>
        <p className={styles.subtitle}>Descubrí quién ganó cada categoría</p>
      </div>

      <div className={styles.grid}>
        {medals.map(({ id, name, desc, winner, value, isTied, tiedPlayers }, i) => {
          if (!winner) return null

          const accentColor = isTied ? tiedPlayers[0].color : winner.color
          const isFlipped   = !!flipped[id]

          return (
            <div
              key={id}
              className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
              onClick={() => toggle(id)}
              style={{
                '--player-color': accentColor,
                animationDelay: `${i * 40}ms`,
              }}
            >
              <div className={styles.cardInner}>

                {/* ══ DORSO — neutro, sin spoiler ════════ */}
                <div className={styles.cardBack}>
                  <div className={styles.backMedalCircle}>
                    <div className={styles.backMedalRing} />
                    <div className={styles.backMedalDisc}>
                      <span className={styles.backMedalIcon}>
                        <MedalIcon id={id} color="var(--neutral-icon)" size={64} />
                      </span>
                    </div>
                  </div>

                  <span className={styles.backMedalName}>{name}</span>
                  <span className={styles.backHint}>revelar</span>
                </div>

                {/* ══ FRENTE — con color del ganador ═════ */}
                <div className={styles.cardFront}>
                  <div className={styles.medalCircle}>
                    <div className={styles.medalRing} />
                    <div className={styles.medalDisc}>
                      <span className={styles.medalIcon}>
                        <MedalIcon id={id} color={accentColor} size={64} />
                      </span>
                    </div>
                  </div>

                  <span className={styles.medalName}>{name}</span>
                  <span className={styles.medalDesc}>{desc}</span>

                  <span className={styles.value}>{formatValue(id, value)}</span>

                  <div className={styles.divider} />

                  {isTied ? (
                    <div className={styles.tiedRow}>
                      {tiedPlayers.map((p, idx) => (
                        <span key={p.steamId}>
                          <span
                            className={styles.tiedName}
                            style={{ color: p.color }}
                          >
                            {p.displayName}
                          </span>
                          {idx < tiedPlayers.length - 1 && (
                            <span className={styles.tiedSep}> · </span>
                          )}
                        </span>
                      ))}
                      <span className={styles.tiedLabel}>empate</span>
                    </div>
                  ) : (
                    <div className={styles.winnerRow}>
                      <span className={styles.winnerDot} />
                      <span className={styles.winnerName}>{winner.displayName}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}