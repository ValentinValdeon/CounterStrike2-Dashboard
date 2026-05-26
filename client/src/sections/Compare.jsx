import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import styles from './Compare.module.css'

const ROWS = [
  { key: 'kd',                label: 'K/D',                  fmt: v => v },
  { key: 'kills',             label: 'Kills',                fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'deaths',            label: 'Deaths',               fmt: v => (+v).toLocaleString('es-AR'), lower: true },
  { key: 'winrate',           label: 'Winrate',              fmt: v => `${v}%` },
  { key: 'hsPercent',         label: 'Headshots',            fmt: v => `${v}%` },
  { key: 'adr',               label: 'ADR',                  fmt: v => v },
  { key: 'mvps',              label: 'MVPs',                 fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'accuracy',          label: 'Precisión',            fmt: v => `${v}%` },
  { key: 'matchesPlayed',     label: 'Partidas',             fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'matchesWon',        label: 'Victorias',            fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'totalDamage',       label: 'Daño Total',           fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'bombsPlanted',      label: 'C4 Plantados',         fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'killsHE',           label: 'Granada HE',           fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'killsMolotov',      label: 'Molotov',              fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'knifeKills',        label: 'Fakazos',              fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'ggMatchesWon',      label: 'Victorias CA',         fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'weaponsDonated',    label: 'Armas donadas',        fmt: v => (+v).toLocaleString('es-AR'), lower: true },
  { key: 'revenges',          label: 'Venganzas',            fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'killsTaser',        label: 'Kills Taser',          fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'killsEnemyWeapon',  label: 'Kills Arma Enemiga',   fmt: v => (+v).toLocaleString('es-AR') },
]

function ShieldIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"/>
    </svg>
  )
}

function CheckIcon({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function CrownIcon({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M2 19h20v2H2zM2 13l4-8 6 5 6-5 4 8H2z"/>
    </svg>
  )
}

function ArrowLeft({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

function ArrowRight({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

function PlayerSelect({ players, value, onChange, side, excludeId }) {
  return (
    <select
      className={`${styles.select} ${side === 'right' ? styles.selectRight : ''}`}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {players.map(p => (
        <option
          key={p.steamId}
          value={p.steamId}
          disabled={p.steamId === excludeId}
        >
          {p.displayName}{p.steamId === excludeId ? ' —' : ''}
        </option>
      ))}
    </select>
  )
}

export default function Compare({ players }) {
  const valid = players.filter(p => p.stats)
  const ref = useReveal(0.05)

  // Randomizer seguro: garantiza r1 !== r2
  const getInitialIds = () => {
    if (valid.length < 2) return ['', '']
    const r1 = Math.floor(Math.random() * valid.length)
    let r2 = Math.floor(Math.random() * (valid.length - 1))
    if (r2 >= r1) r2++
    return [valid[r1].steamId, valid[r2].steamId]
  }

  const [initialLeft, initialRight] = getInitialIds()
  const [leftId,  setLeftId]  = useState(initialLeft)
  const [rightId, setRightId] = useState(initialRight)

  if (valid.length < 2) return null

  const left  = valid.find(p => p.steamId === leftId)  || valid[0]
  const right = valid.find(p => p.steamId === rightId) || valid[1]

  // Nunca permite seleccionar el mismo jugador en ambos lados
  const handleLeftChange = (newId) => {
    if (newId === rightId) {
      const fallback = valid.find(p => p.steamId !== newId)
      if (fallback) setRightId(fallback.steamId)
    }
    setLeftId(newId)
  }

  const handleRightChange = (newId) => {
    if (newId === leftId) {
      const fallback = valid.find(p => p.steamId !== newId)
      if (fallback) setLeftId(fallback.steamId)
    }
    setRightId(newId)
  }

  const getStatValue = (player, key) => {
    if (key === 'totalDamage')    return player.stats.totalDamage || 0
    if (key === 'bombsPlanted')   return player.stats.utility?.bombsPlanted || 0
    if (key === 'killsHE')        return player.stats.utility?.killsHE || 0
    if (key === 'killsMolotov')   return player.stats.utility?.killsMolotov || 0
    if (key === 'knifeKills')     return player.stats.weapons?.knife?.kills || 0
    return parseFloat(player.stats[key]) || 0
  }

  const getDisplayValue = (player, key, fmt) => {
    const numericKeys = ['totalDamage','bombsPlanted','killsHE','killsMolotov','knifeKills',
      'kills','deaths','mvps','matchesPlayed','matchesWon','ggMatchesWon',
      'weaponsDonated','revenges','killsTaser','killsEnemyWeapon']
    const val = getStatValue(player, key)
    if (numericKeys.includes(key)) return (+val).toLocaleString('es-AR')
    return fmt(player.stats[key])
  }

  let leftPoints = 0
  let rightPoints = 0
  ROWS.forEach(row => {
    const lv = getStatValue(left, row.key)
    const rv = getStatValue(right, row.key)
    if (row.lower ? lv < rv : lv > rv) leftPoints++
    else if (row.lower ? rv < lv : rv > lv) rightPoints++
  })

  const total = leftPoints + rightPoints
  const leftPct  = total > 0 ? (leftPoints  / total) * 100 : 50
  const rightPct = total > 0 ? (rightPoints / total) * 100 : 50
  const winner = leftPoints > rightPoints ? 'left' : rightPoints > leftPoints ? 'right' : 'tie'

  return (
    <section className={`section ${styles.compare}`} id="compare">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>CARA A CARA</h2>
          <p className={styles.sub}>Stat por stat — que gane el mejor</p>
        </header>

        {/* Selectores */}
        <div className={styles.selectors}>
          <PlayerSelect
            players={valid}
            value={left.steamId}
            onChange={handleLeftChange}
            side="left"
            excludeId={right.steamId}
          />
          <div className={styles.vsBlock}>
            <span className={styles.vs}>VS</span>
          </div>
          <PlayerSelect
            players={valid}
            value={right.steamId}
            onChange={handleRightChange}
            side="right"
            excludeId={left.steamId}
          />
        </div>

        {/* Tabla */}
        <div className={`reveal ${styles.table}`} ref={ref}>

          {/* Cabecera */}
          <div className={styles.tableHead}>
            <div className={styles.headPlayer}>
              <ShieldIcon color={left.color} />
              <span style={{ color: left.color }}>{left.displayName}</span>
            </div>
            <div className={styles.headStat}>STAT</div>
            <div className={`${styles.headPlayer} ${styles.headPlayerRight}`}>
              <span style={{ color: right.color }}>{right.displayName}</span>
              <ShieldIcon color={right.color} />
            </div>
          </div>

          {/* Barra de ventaja en tiempo real */}
          <div className={styles.advantageBar}>
            <div className={styles.advantageLeft}  style={{ width: `${leftPct}%`,  background: left.color  }} />
            <div className={styles.advantageRight} style={{ width: `${rightPct}%`, background: right.color }} />
          </div>

          {/* Filas de stats */}
          {ROWS.map(row => {
            const lv    = getStatValue(left,  row.key)
            const rv    = getStatValue(right, row.key)
            const lWins = row.lower ? lv < rv : lv > rv
            const rWins = row.lower ? rv < lv : rv > lv
            const tie   = !lWins && !rWins

            return (
              <div
                key={row.key}
                className={`${styles.row} ${lWins ? styles.rowLeft : ''} ${rWins ? styles.rowRight : ''} ${tie ? styles.rowTie : ''}`}
                style={{ '--lc': left.color, '--rc': right.color }}
              >
                {/* Celda izquierda */}
                <div className={`${styles.cell} ${styles.cellLeft} ${lWins ? styles.cellWin : ''}`}>
                  {lWins && (
                    <span className={styles.checkIcon}>
                      <CheckIcon color={left.color} />
                    </span>
                  )}
                  <span
                    className={styles.cellValue}
                    style={{ color: lWins ? left.color : undefined, fontWeight: lWins ? 600 : undefined }}
                  >
                    {getDisplayValue(left, row.key, row.fmt)}
                  </span>
                </div>

                {/* Label central con flechas */}
                <div className={styles.rowLabel}>
                  {lWins && <ArrowLeft color={left.color} />}
                  <span className={styles.labelText}>{row.label}</span>
                  {rWins && <ArrowRight color={right.color} />}
                </div>

                {/* Celda derecha */}
                <div className={`${styles.cell} ${styles.cellRight} ${rWins ? styles.cellWin : ''}`}>
                  <span
                    className={styles.cellValue}
                    style={{ color: rWins ? right.color : undefined, fontWeight: rWins ? 600 : undefined }}
                  >
                    {getDisplayValue(right, row.key, row.fmt)}
                  </span>
                  {rWins && (
                    <span className={styles.checkIcon}>
                      <CheckIcon color={right.color} />
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {/* Resultado final */}
          <div className={styles.resultRow} style={{ '--lc': left.color, '--rc': right.color }}>
            <div className={`${styles.resultSide} ${styles.resultSideLeft} ${winner === 'left' ? styles.resultSideWinner : ''}`}>
              {winner === 'left' && (
                <span className={styles.crownIcon}>
                  <CrownIcon color={left.color} />
                </span>
              )}
              <span
                className={styles.resultPts}
                style={{ color: winner === 'left' ? left.color : 'var(--text-dim)' }}
              >
                {leftPoints}
                <span className={styles.ptsLabel}>pts</span>
              </span>
              {winner === 'left' && (
                <span
                  className={styles.winnerBadge}
                  style={{
                    background: left.color + '1a',
                    border: `1px solid ${left.color}50`,
                    color: left.color,
                  }}
                >
                  GANADOR
                </span>
              )}
            </div>

            <div className={styles.resultCenter}>
              {winner === 'tie'
                ? <span className={styles.tieLabel}>EMPATE</span>
                : <span className={styles.resultDivider} />
              }
            </div>

            <div className={`${styles.resultSide} ${styles.resultSideRight} ${winner === 'right' ? styles.resultSideWinner : ''}`}>
              {winner === 'right' && (
                <span
                  className={styles.winnerBadge}
                  style={{
                    background: right.color + '1a',
                    border: `1px solid ${right.color}50`,
                    color: right.color,
                  }}
                >
                  GANADOR
                </span>
              )}
              <span
                className={styles.resultPts}
                style={{ color: winner === 'right' ? right.color : 'var(--text-dim)' }}
              >
                {rightPoints}
                <span className={styles.ptsLabel}>pts</span>
              </span>
              {winner === 'right' && (
                <span className={styles.crownIcon}>
                  <CrownIcon color={right.color} />
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}