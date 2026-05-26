import { useState, useRef, useEffect, useCallback } from 'react'
import { useReveal } from '../hooks/useReveal'
import styles from './Podium.module.css'

const STATS = [
  { key: 'hsPercent',        label: 'HS%',           fmt: v => `${v}%` },
  { key: 'adr',              label: 'ADR',           fmt: v => v },
  { key: 'mvps',             label: 'MVPs',          fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'accuracy',         label: 'Precisión',     fmt: v => `${v}%` },
  { key: 'totalDamage',      label: 'Daño Total',    fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'bombsPlanted',     label: 'C4 Plantados',  fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'killsHE',          label: 'Granadas',      fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'killsMolkov',      label: 'Molotov',       fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'knifeKills',       label: 'Fakazos',       fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'ggMatchesWon',     label: 'Carrera Arm.',  fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'weaponsDonated',   label: 'Donadas',       fmt: v => (+v).toLocaleString('es-AR'), lower: true },
  { key: 'revenges',         label: 'Venganzas',     fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'killsTaser',       label: 'Taser',         fmt: v => (+v).toLocaleString('es-AR') },
  { key: 'killsEnemyWeapon', label: 'Arma Enemiga',  fmt: v => (+v).toLocaleString('es-AR') },
]

const CX    = 210
const CY    = 185
const R     = 138
const RINGS = 4
const NS    = 'http://www.w3.org/2000/svg'

function polarToXY(angle, r) {
  const rad = (angle - 90) * Math.PI / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function getStatValue(p, key) {
  const s = p.stats
  if (key === 'totalDamage')   return s.totalDamage || 0
  if (key === 'bombsPlanted')  return s.utility?.bombsPlanted || 0
  if (key === 'killsHE')       return s.utility?.killsHE || 0
  if (key === 'killsMolkov')   return s.utility?.killsMolotov || 0
  if (key === 'knifeKills')    return s.weapons?.knife?.kills || 0
  return parseFloat(s[key]) || 0
}

function fmtVal(stat, v) {
  return stat.fmt ? stat.fmt(v) : (+v).toLocaleString('es-AR')
}

function pointsToStr(pts) {
  return pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
}

function lerp(a, b, t) { return a + (b - a) * t }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }

function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(NS, tag)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v)
  if (text != null) e.textContent = text
  return e
}

// ─────────────────────────────────────────────────────────────────
// RadarChart
// ─────────────────────────────────────────────────────────────────
function RadarChart({ players, activeIdx, animKey, selectedId }) {
  const svgRef      = useRef(null)
  const frameRef    = useRef(null)
  const prevRRef    = useRef(null)
  const focusedPts  = useRef([])    // puntos del focused para hover
  const tooltipRef  = useRef(null)  // grupo SVG del tooltip activo

  const nAxes = STATS.length
  const keys  = STATS.map(s => s.key)
  const maxes = keys.map(k => Math.max(...players.map(p => getStatValue(p, k)), 0.01))

  const stat     = STATS[activeIdx]
  const sorted   = [...players].sort((a, b) => {
    const av = getStatValue(a, stat.key), bv = getStatValue(b, stat.key)
    return stat.lower ? av - bv : bv - av
  })
  const winnerId  = sorted[0]?.steamId
  const focusedId = selectedId ?? winnerId
  const focusedPlayer = players.find(p => p.steamId === focusedId)

  const captureRadii = useCallback(() => {
    const r = {}
    players.forEach(p => {
      r[p.steamId] = keys.map((key, i) =>
        Math.max(getStatValue(p, key) / (maxes[i] || 1), 0.04) * R
      )
    })
    return r
  }, [players, activeIdx])

  // ── dibuja un tooltip en el SVG sobre el punto pi del focused ──
  function showTooltip(pi) {
    const svg = svgRef.current
    if (!svg || !focusedPlayer) return
    removeTooltip()

    const entry    = focusedPts.current[pi]
    if (!entry) return
    const { pt, statMeta, val, angle } = entry
    const color    = focusedPlayer.color
    const valStr   = fmtVal(statMeta, val)

    const ptX    = polarToXY(angle, 1).x   // x normalizado (radio 1)
    const anchor = ptX > CX + 4 ? 'start' : ptX < CX - 4 ? 'end' : 'middle'
    const BH    = 30
    const BW    = Math.max(valStr.length * 6.8 + 12, statMeta.label.length * 5.5 + 12, 46)
    const lpos  = polarToXY(angle, entry.pct * R + 22)
    const bx = anchor === 'start'
      ? lpos.x - 5
      : anchor === 'end'
        ? lpos.x - BW + 5
        : lpos.x - BW / 2
    const by    = lpos.y - BH / 2

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('class', 'radar-tooltip')
    g.style.pointerEvents = 'none'

    // fondo
    const rect = svgEl('rect', {
      x: bx, y: by, width: BW, height: BH, rx: '3',
      fill: 'var(--bg-elevated)',
      stroke: color, 'stroke-width': '1.5',
    })
    // nombre stat
    const t1 = svgEl('text', {
      x: (bx + BW / 2).toFixed(1), y: (by + 10).toFixed(1),
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      'font-size': '7', fill: color,
      'font-family': 'var(--mono)', 'letter-spacing': '0.1em', 'font-weight': '600',
    }, statMeta.label.toUpperCase())
    // valor
    const t2 = svgEl('text', {
      x: (bx + BW / 2).toFixed(1), y: (by + 22).toFixed(1),
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      'font-size': '10.5', fill: 'var(--text)',
      'font-family': 'var(--mono)', 'letter-spacing': '0.03em', 'font-weight': '700',
    }, valStr)

    g.appendChild(rect)
    g.appendChild(t1)
    g.appendChild(t2)
    svg.appendChild(g)
    tooltipRef.current = g
  }

  function removeTooltip() {
    if (tooltipRef.current) {
      tooltipRef.current.remove()
      tooltipRef.current = null
    }
  }

  // ── hover: detectar proximidad a cada punto focused ──
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    function onMouseMove(e) {
      const rect   = svg.getBoundingClientRect()
      const scaleX = 420 / rect.width
      const scaleY = 370 / rect.height
      const mx     = (e.clientX - rect.left) * scaleX
      const my     = (e.clientY - rect.top)  * scaleY

      let closest = -1, minDist = 24   // px en coordenadas viewBox

      focusedPts.current.forEach((entry, pi) => {
        const dx = mx - entry.pt.x
        const dy = my - entry.pt.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < minDist) { minDist = d; closest = pi }
      })

      if (closest !== -1) {
        showTooltip(closest)
      } else {
        removeTooltip()
      }
    }

    function onMouseLeave() { removeTooltip() }

    svg.addEventListener('mousemove', onMouseMove)
    svg.addEventListener('mouseleave', onMouseLeave)
    return () => {
      svg.removeEventListener('mousemove', onMouseMove)
      svg.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [focusedId, activeIdx])   // re-bind cuando cambie el focused

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const prevR = prevRRef.current
    const dur   = 480
    let start   = null
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    removeTooltip()
    focusedPts.current = []

    function draw(prog) {
      // limpiar solo shapes/grid, no el tooltip (que se agrega aparte)
      while (svg.firstChild) svg.removeChild(svg.firstChild)

      // grid rings
      for (let ring = 1; ring <= RINGS; ring++) {
        const rr  = (R * ring) / RINGS
        const pts = Array.from({ length: nAxes }, (_, i) =>
          polarToXY((360 / nAxes) * i, rr)
        ).map(p => `${p.x},${p.y}`).join(' ')
        svg.appendChild(svgEl('polygon', {
          points: pts, fill: 'none',
          stroke: 'var(--border-low)', 'stroke-width': '0.5',
        }))
      }
      // spokes
      for (let i = 0; i < nAxes; i++) {
        const tip = polarToXY((360 / nAxes) * i, R)
        svg.appendChild(svgEl('line', {
          x1: CX, y1: CY, x2: tip.x, y2: tip.y,
          stroke: 'var(--border-low)', 'stroke-width': '0.5',
        }))
      }
      // axis labels
      for (let i = 0; i < nAxes; i++) {
        const angle    = (360 / nAxes) * i
        const pos      = polarToXY(angle, R + 24)
        const isActive = !selectedId && i === activeIdx
        svg.appendChild(svgEl('text', {
          x: pos.x, y: pos.y,
          'text-anchor': 'middle', 'dominant-baseline': 'middle',
          'font-size': isActive ? '10' : '8.5',
          fill: isActive ? 'var(--text)' : 'var(--text-dim)',
          'font-family': 'var(--mono)', 'letter-spacing': '0.07em',
          'font-weight': isActive ? '600' : '400',
        }, STATS[i].label.toUpperCase()))
      }

      // shapes
      const order = [...players].sort((a, b) =>
        (a.steamId === focusedId ? 1 : 0) - (b.steamId === focusedId ? 1 : 0)
      )

      order.forEach(player => {
        const isF   = player.steamId === focusedId
        const dimmed = !!selectedId && !isF

        const pts = keys.map((key, i) => {
          const val    = getStatValue(player, key)
          const target = Math.max(val / (maxes[i] || 1), 0.04) * R
          const prev   = prevR?.[player.steamId]?.[i]
          const r      = prev != null ? lerp(prev, target, prog) : target * prog
          return polarToXY((360 / nAxes) * i, r)
        })

        svg.appendChild(svgEl('polygon', {
          points: pointsToStr(pts),
          fill: player.color,
          'fill-opacity': dimmed ? '0.02' : isF ? '0.22' : '0.07',
          stroke: player.color, 'stroke-width': isF ? '2.5' : '1',
          'stroke-opacity': dimmed ? '0.12' : isF ? '1' : '0.4',
        }))

        pts.forEach((pt, pi) => {
          svg.appendChild(svgEl('circle', {
            cx: pt.x.toFixed(2), cy: pt.y.toFixed(2),
            r: isF ? '4' : '2', fill: player.color,
            'fill-opacity': dimmed ? '0.12' : '1',
          }))

          // zona de hit invisible más grande para hover fácil
          if (isF) {
            const hit = svgEl('circle', {
              cx: pt.x.toFixed(2), cy: pt.y.toFixed(2),
              r: '14', fill: 'transparent', 'data-pi': pi,
            })
            hit.style.cursor = 'crosshair'
            svg.appendChild(hit)
          }
        })
      })
    }

    function step(ts) {
      if (!start) start = ts
      const p = Math.min((ts - start) / dur, 1)
      draw(easeOutCubic(p))
      if (p < 1) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        prevRRef.current = captureRadii()
        // poblar focusedPts para que el hover funcione
        focusedPts.current = keys.map((key, i) => {
          const val  = getStatValue(focusedPlayer, key)
          const pct  = Math.max(val / (maxes[i] || 1), 0.04)
          const angle = (360 / nAxes) * i
          return {
            pt: polarToXY(angle, pct * R),
            statMeta: STATS[i],
            val,
            angle,
            pct,
          }
        })
      }
    }

    prevRRef.current = captureRadii()
    frameRef.current = requestAnimationFrame(step)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [activeIdx, animKey, selectedId])

  return (
    <svg
      ref={svgRef}
      className={styles.radarSvg}
      viewBox="0 0 420 370"
      role="img"
      aria-label="Gráfico de radar de jugadores"
    />
  )
}

// ─────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────
export default function Podium({ players }) {
  const [activeIdx,  setActiveIdx]  = useState(0)
  const [animKey,    setAnimKey]    = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const ref = useReveal(0.1)

  const valid = players.filter(p => p.stats)
  if (valid.length === 0) return null

  const stat   = STATS[activeIdx]
  const sorted = [...valid].sort((a, b) => {
    const av = getStatValue(a, stat.key), bv = getStatValue(b, stat.key)
    return stat.lower ? av - bv : bv - av
  })
  const winner  = sorted[0]
  const focused = selectedId ? valid.find(p => p.steamId === selectedId) : winner

  const handleStatChange = (idx) => {
    if (idx === activeIdx) return
    setActiveIdx(idx)
    setSelectedId(null)
    setAnimKey(k => k + 1)
  }

  const handlePlayerSelect = (steamId) => {
    const next = selectedId === steamId ? null : steamId
    setSelectedId(next)
    setAnimKey(k => k + 1)
  }

  return (
    <section className={`section ${styles.podium}`} id="podium">
      <div className={styles.inner} ref={ref}>
        <div className={styles.layout}>

          {/* ── LEFT ── */}
          <aside className={styles.statPanel}>
            <div className={styles.statPanelHeader}>
              <p className={styles.statPanelSub}>Estadísticas</p>
              <h2 className={styles.statPanelTitle}>Ranking</h2>
            </div>
            <nav className={styles.statList}>
              {STATS.map((s, i) => {
                const rowWinner = [...valid].sort((a, b) => {
                  const av = getStatValue(a, s.key), bv = getStatValue(b, s.key)
                  return s.lower ? av - bv : bv - av
                })[0]
                return (
                  <button
                    key={s.key}
                    className={`${styles.statItem} ${i === activeIdx ? styles.statItemActive : ''}`}
                    style={i === activeIdx ? { '--active-accent': rowWinner?.color } : {}}
                    onClick={() => handleStatChange(i)}
                  >
                    <span className={styles.statNum}>{String(i + 1).padStart(2, '0')}</span>
                    {s.label}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* ── RIGHT ── */}
          <div className={styles.chartPanel}>
            <div className={styles.chartHeader}>
              <div>
                <p className={styles.chartSub}>
                  {selectedId ? 'Jugador seleccionado' : 'Categoría activa'}
                </p>
                <h3 className={styles.chartTitle}>
                  {selectedId ? focused?.displayName : stat.label}
                </h3>
              </div>

              {/* Leyenda clickeable → selector de jugador */}
              <div className={styles.legend}>
                {valid.map(p => {
                  const isWinner   = !selectedId && p.steamId === winner?.steamId
                  const isSelected = p.steamId === selectedId
                  return (
                    <button
                      key={p.steamId}
                      className={[
                        styles.legendBtn,
                        isSelected  ? styles.legendBtnSelected : '',
                        isWinner    ? styles.legendBtnWinner   : '',
                      ].join(' ')}
                      style={{ '--p-color': p.color }}
                      onClick={() => handlePlayerSelect(p.steamId)}
                      title={isSelected ? 'Deseleccionar' : `Ver radar de ${p.displayName}`}
                    >
                      <span
                        className={styles.legendSwatch}
                        style={{
                          background: p.color,
                          opacity: selectedId && !isSelected ? 0.25 : 1,
                        }}
                      />
                      <span className={styles.legendName}>{p.displayName}</span>
                      {isSelected && (
                        <svg className={styles.legendCheck} viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className={styles.chartArea}>
              <RadarChart
                players={valid}
                activeIdx={activeIdx}
                animKey={animKey}
                selectedId={selectedId}
              />

              {/* Banner ganador — modo ranking */}
              {!selectedId && winner && (
                <div
                  className={styles.winnerBanner}
                  key={`w-${activeIdx}-${animKey}`}
                  style={{ '--winner-color': winner.color }}
                >
                  <svg className={styles.bannerIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 12h12M3 12L2 5l3.5 3L8 3l2.5 5L14 5l-1 7H3z"
                      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                  <span className={styles.winnerLabel}>Ganador</span>
                  <span className={styles.winnerName} style={{ color: winner.color }}>
                    {winner.displayName}
                  </span>
                  <span className={styles.winnerVal}>{fmtVal(stat, getStatValue(winner, stat.key))}</span>
                </div>
              )}

              {/* Banner jugador — modo perfil */}
              {selectedId && focused && (
                <div
                  className={styles.winnerBanner}
                  key={`p-${selectedId}`}
                  style={{ '--winner-color': focused.color }}
                >
                  <svg className={styles.bannerIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M3 13h10M4 13V9.5a4 4 0 018 0V13"
                      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                  <span className={styles.winnerLabel}>Perfil</span>
                  <span className={styles.winnerName} style={{ color: focused.color }}>
                    {focused.displayName}
                  </span>
                  <span className={styles.winnerVal}>
                    {stat.label}: {fmtVal(stat, getStatValue(focused, stat.key))}
                  </span>
                  <button
                    className={styles.bannerClose}
                    onClick={() => { setSelectedId(null); setAnimKey(k => k + 1) }}
                    aria-label="Volver a ranking"
                  >
                    <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}