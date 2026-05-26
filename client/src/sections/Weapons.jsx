import { useReveal } from '../hooks/useReveal'
import styles from './Weapons.module.css'

// Mapa de nombre técnico → nombre legible
const WEAPON_NAMES = {
  ak47: 'AK-47', m4a1: 'M4A1-S', m4a4: 'M4A4', awp: 'AWP',
  deagle: 'Desert Eagle', usp_silencer: 'USP-S', glock: 'Glock-18',
  mp9: 'MP9', mac10: 'MAC-10', p250: 'P250', fiveseven: 'Five-SeveN',
  sg556: 'SG 553', aug: 'AUG', famas: 'FAMAS', galil: 'Galil AR',
  scout: 'SSG 08', g3sg1: 'G3SG1', ssg08: 'SSG 08', knife: 'Cuchillo',
  hkp2000: 'P2000', p90: 'P-90', mp5sd: 'MP5-SD', ump45: 'UMP-45',
  bizon: 'PP-Bizon', mag7: 'MAG-7', nova: 'Nova', xm1014: 'XM1014',
  sawedoff: 'Sawed-Off', m249: 'M249', negev: 'Negev', tec9: 'Tec-9',
  cz75a: 'CZ75-Auto', revolver: 'R8 Revolver',
}

function weaponLabel(key) {
  return WEAPON_NAMES[key] || key.replace(/_/g, ' ').toUpperCase()
}

export default function Weapons({ players }) {
  const ref = useReveal(0.05)

  const valid = players.filter(p => p.stats?.weapons)
  if (valid.length === 0) return null

  const playersWithStats = valid.slice(0, 5) // Máximo 5 jugadores

  // Función para obtener color RGB del jugador para degradado
  const getPlayerColorRGB = (color) => {
    if (color === '#a78bfa') return '167,139,250' // violeta
    if (color === '#34d399') return '52,211,153' // verde
    if (color === '#60a5fa') return '96,165,250' // azul
    if (color === '#fbbf24') return '251,191,36'  // amarillo
    if (color === '#f97316') return '249,115,22'  // naranja
    return '167,139,250'
  }

  // Calcular kills por arma por jugador
  const totals = {}
  const playerKills = {}
  
  valid.forEach(p => {
    playerKills[p.steamId] = {}
    Object.entries(p.stats.weapons).forEach(([weapon, data]) => {
      if (!totals[weapon]) totals[weapon] = { kills: 0, shots: 0, hits: 0 }
      totals[weapon].kills += data.kills || 0
      totals[weapon].shots += data.shots || 0
      totals[weapon].hits  += data.hits  || 0
      
      // Kills por jugador
      if (!playerKills[p.steamId][weapon]) playerKills[p.steamId][weapon] = 0
      playerKills[p.steamId][weapon] += data.kills || 0
    })
  })

  const top10 = Object.entries(totals)
    .map(([weapon, d]) => ({
      weapon,
      kills: d.kills,
      accuracy: d.shots > 0 ? Math.round((d.hits / d.shots) * 100) : 0,
    }))
    .filter(x => x.kills > 0)
    .sort((a, b) => b.kills - a.kills)
    .slice(0, 10)

  const maxKills = top10[0]?.kills || 1

  return (
    <section className={`section ${styles.weapons}`} id="weapons">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>ARMAMENTO</h2>
          <p className={styles.sub}>Top 10 armas por bajas del grupo</p>
        </header>

        <div className={`reveal ${styles.table}`} ref={ref}>
          {/* Cabecera */}
          <div className={styles.thead}>
            <span className={styles.thRank}>#</span>
            <span className={styles.thName}>Arma</span>
            <span className={styles.thBar}>Total</span>
            {playersWithStats.map(p => (
              <span key={p.steamId} className={styles.thPlayer} style={{ color: p.color }}>
                {p.displayName}
              </span>
            ))}
            <span className={styles.thNum}>Kills</span>
            <span className={styles.thNum}>Acc%</span>
          </div>

          {top10.map((row, i) => (
            <div key={row.weapon} className={styles.trow}>
              <span className={styles.tdRank}>{i + 1}</span>
              <span className={styles.tdName}>{weaponLabel(row.weapon)}</span>
              <div className={styles.tdBar}>
                <div
                  className={styles.tdBarFill}
                  style={{ width: `${(row.kills / maxKills) * 100}%` }}
                />
              </div>
              {playersWithStats.map(p => (
                <span 
                  key={p.steamId} 
                  className={styles.tdPlayer}
                  style={{ 
                    background: `linear-gradient(135deg, rgba(${getPlayerColorRGB(p.color)},0.15) 0%, transparent 100%)`,
                    color: p.color
                  }}
                >
                  {(playerKills[p.steamId]?.[row.weapon] || 0).toLocaleString('es-AR')}
                </span>
              ))}
              <span className={styles.tdNum}>{row.kills.toLocaleString('es-AR')}</span>
              <span className={styles.tdNum}>{row.accuracy}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
