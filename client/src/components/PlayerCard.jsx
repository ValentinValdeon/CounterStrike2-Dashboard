import styles from './PlayerCard.module.css'

const DEFAULT_AVATAR = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'

function KD({ value }) {
  const v = parseFloat(value)
  const color = v >= 1.2 ? 'var(--green)' : v >= 0.9 ? 'var(--yellow)' : 'var(--red)'
  return <span style={{ color }}>{value}</span>
}

function StatBox({ label, value }) {
  return (
    <div className={styles.statBox}>
      <span className={styles.statVal}>{value}</span>
      <span className={styles.statLab}>{label}</span>
    </div>
  )
}

export default function PlayerCard({ player }) {
  const { displayName, color, avatar, profilePrivate, stats, totalHours } = player

  const timePlayed = stats?.timePlayed ? Math.floor(stats.timePlayed / 60) : null // minutos a horas
  const hoursStr = timePlayed ? `${timePlayed}h` : '—'

  const totalHoursStr = totalHours ? `${totalHours}h` : null

  return (
    <article className={`${styles.card} interactive`} style={{ '--c': color }}>

      {/* Esquinas decorativas */}
      <span className={`${styles.corner} ${styles.cornerTL}`} />
      <span className={`${styles.corner} ${styles.cornerTR}`} />
      <span className={`${styles.corner} ${styles.cornerBL}`} />
      <span className={`${styles.corner} ${styles.cornerBR}`} />

      {/* Línea superior de color */}
      <div className={styles.topBar} />

      {/* Scanline overlay */}
      <div className={styles.scanlines} />

      {/* Glitch layers — solo visibles en hover vía CSS */}
      <div className={styles.glitchR} aria-hidden="true" />
      <div className={styles.glitchB} aria-hidden="true" />

      {/* ── HEADER ── */}
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          <img src={avatar || DEFAULT_AVATAR} alt={displayName} className={styles.avatar} loading="lazy" decoding="async" />
        </div>
        <div className={styles.nameBlock}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{displayName}</h3>
          </div>
          <div className={styles.metaRow}>
            {!profilePrivate && stats && (
              <>
                <span className={styles.hours}>{hoursStr}</span>
                {totalHoursStr && <span className={styles.totalHours}>{totalHoursStr}</span>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      {profilePrivate || !stats ? (
        <div className={styles.private}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <p className={styles.privateTitle}>PERFIL PRIVADO</p>
          <p className={styles.privateSub}>Activar datos de juego públicos en Steam</p>
        </div>
      ) : (
        <>
          {/* K/D hero */}
          <div className={styles.kdSection}>
            <div className={styles.kdNum} data-kd={stats.kd}>
              <KD value={stats.kd} />
            </div>
            <div className={styles.kdMeta}>
              <span className={styles.kdLabel}>K/D RATIO</span>
              <div className={styles.kdBreak}>
                <span className={styles.kdK}>{stats.kills.toLocaleString('es-AR')}</span>
                <span className={styles.kdSep}>/</span>
                <span className={styles.kdD}>{stats.deaths.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerDot} />
            <span className={styles.dividerLine} />
          </div>

          {/* Stats grid */}
          <div className={styles.statsGrid}>
            <StatBox label="PARTIDAS"  value={stats.matchesPlayed.toLocaleString('es-AR')} />
            <StatBox label="MVPs"      value={stats.mvps.toLocaleString('es-AR')} />
            <StatBox label="WINRATE"   value={`${stats.winrate}%`} />
            <StatBox label="HS%"       value={`${stats.hsPercent}%`} />
            <StatBox label="HEADSHOTS" value={stats.headshots.toLocaleString('es-AR')} />
            <StatBox label="PRECISIÓN" value={`${stats.accuracy}%`} />
            <StatBox label="ADR"       value={stats.adr} />
            <StatBox label="BLINDEADOS" value={stats.utility?.killsBlinded?.toLocaleString('es-AR') || '0'} />
            <StatBox label="DEFUSE"    value={stats.utility?.bombsDefused?.toLocaleString('es-AR') || '0'} />
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerDot} />
            <span className={styles.dividerLine} />
          </div>

          {/* W/L bar */}
          <div className={styles.wl}>
            <div className={styles.wlItem}>
              <span className={styles.wlNum}>
                {stats.matchesWon.toLocaleString('es-AR')}
              </span>
              <span className={styles.wlLab}>GANADAS</span>
            </div>
            <div className={styles.wlBar}>
              <div
                className={styles.wlFill}
                style={{ width: `${stats.winrate}%`, background: 'var(--c)' }}
              />
            </div>
            <div className={styles.wlItem} style={{ textAlign: 'right' }}>
              <span className={styles.wlNum}>
                {stats.matchesLost.toLocaleString('es-AR')}
              </span>
              <span className={styles.wlLab}>PERDIDAS</span>
            </div>
          </div>
        </>
      )}
    </article>
  )
}
