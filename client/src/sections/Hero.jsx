import styles from './Hero.module.css'

const DEFAULT_AVATAR = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'

export default function Hero({ players, lastFetch }) {
  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section className={styles.hero}>
      {/* Fondo — gradiente radial central */}
      <div className={styles.glow} />

      {/* Partículas de fondo */}
      <div className={styles.particles} aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className={styles.particle} style={{ '--i': i }} />
        ))}
      </div>

      {/* Líneas de escaneo (scanlines) */}
      <div className={styles.scanlines} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Tagline */}
        <p className={styles.tag}>CS2 + CS:GO · Estadísticas del grupo</p>

        {/* Título con glitch RGB Split */}
        <h1 className={styles.title}>
          <span className={styles.glitchWrapper}>
            <span className={styles.titleLine} aria-hidden="false">MALARDOS</span>
            <span className={styles.titleGlitchR} aria-hidden="true">MALARDOS</span>
            <span className={styles.titleGlitchB} aria-hidden="true">MALARDOS</span>
          </span>
          <span className={styles.titleLineOutline}>TEAM</span>
        </h1>

        {/* Avatares — sin K/D */}
        <div className={styles.avatars}>
          {players.map((p, i) => (
            <div
              key={p.steamId}
              className={styles.avatarItem}
              style={{
                '--color': p.color,
                animationDelay: `${i * 120 + 900}ms`
              }}
            >
              <div className={styles.avatarRing}>
                <img
                  src={p.avatar || DEFAULT_AVATAR}
                  alt={p.displayName}
                  className={styles.avatarImg}
                  loading="lazy"
                  decoding="async"
                />
                {p.online && <span className={styles.onlineDot} />}
              </div>
              <span className={styles.avatarName}>{p.displayName}</span>
            </div>
          ))}
        </div>

        {/* Meta */}
        <p className={styles.meta}>
          {players.length} jugadores
          {lastFetch && ` · actualizado ${lastFetch.toLocaleTimeString('es-AR')}`}
        </p>
      </div>

      {/* Flecha scroll */}
      <button className={styles.scrollArrow} onClick={scrollDown} aria-label="Scroll">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <polyline points="19 12 12 19 5 12"/>
        </svg>
      </button>
    </section>
  )
}