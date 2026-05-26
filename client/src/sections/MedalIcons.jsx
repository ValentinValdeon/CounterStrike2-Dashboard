// ═══════════════════════════════════════════════════════
//  MEDAL ICONS — Imágenes externas por medalla
//  Uso: <MedalIcon id="most_kills" color="#f87171" size={28} />
//
//  Para reemplazar cada slot, pega tu <img> dentro del
//  objeto MEDAL_IMAGES en la key correspondiente.
//  Si una key no tiene imagen, se usa el SVG de fallback.
// ═══════════════════════════════════════════════════════

// ── Slot de imágenes ─────────────────────────────────────
// Reemplaza null por tu <img width="67" height="67" src="..." alt="..." />
// en cada medalla que quieras personalizar.

const MEDAL_IMAGES = {

  // ── Estadísticas generales ────────────────────────────

  most_kills:     <img width="67" height="67" src=".\assets\icons8-dead-85.png" alt="most_kills" />,

  most_deaths:    <img width="64" height="64" src=".\assets\calavera.png" alt="skull"/>,

  best_kd:        <img width="67" height="67" src=".\assets\icons8-predator-100.png" alt="predator" />,

  best_winrate:   <img width="67" height="67" src=".\assets\icons8-trophy-64.png" alt="best_winrate" />,

  best_hs:        <img width="67" height="67" src=".\assets\icons8-shooter-game-67 (1).png" alt="best_hs" />,

  best_accuracy:  <img width="67" height="67" src=".\assets\icons8-accuracy-62.png" alt="best_accuracy" />,

  best_mvp_rate:  <img width="67" height="67" src=".\assets\medalla.png" alt="best_mvp_rate" />,

  most_time:      <img width="67" height="67" src=".\assets\icons8-hourglass-100.png" alt="most_time" />,

  best_bpk:       <img width="67" height="67" src=".\assets\icons8-skull-crossbones-100.png" alt="best_bpk" />,

  best_adr:       <img width="67" height="67" src=".\assets\tanque.png" alt="best_adr" />,

  // ── Medallas especiales ───────────────────────────────

  gg_wins:        null,
  // <img width="67" height="67" src=".\assets\" alt="gg_wins" />

  pistol_wins:    <img width="67" height="67" src=".\assets\icons8-sheriff-49.png" alt="pistol_wins" />,

  most_donated:   <img width="67" height="67" src=".\assets\icons8-friend-51.png" alt="most_donated" />,

  most_revenges:  <img width="67" height="67" src=".\assets\icons8-punisher-128.png" alt="most_revenges" />,

  taser_god:      <img width="67" height="67" src=".\assets\taser.png" alt="taser_god" />,

  knife_god:      <img width="67" height="67" src=".\assets\faka.png" alt="knife_god" />,

  sniper_hunter:  <img width="67" height="67" src=".\assets\mira.png" alt="sniper_hunter" />,

  enemy_weapon:   <img width="67" height="67" src=".\assets\icons8-headshot-51.png" alt="enemy_weapon" />,

  // ── Armas ─────────────────────────────────────────────

  weapon_ak47:    <img width="67" height="67" src=".\assets\ak47.png" alt="weapon_ak47" />,

  weapon_m4a1:    <img width="67" height="67" src=".\assets\m4-cruzada.png" alt="weapon_m4a1" />,

  weapon_awp:     <img width="67" height="67" src=".\assets\sniper-mejorado.png" alt="weapon_awp" />,

  weapon_deagle:  null,
  // <img width="67" height="67" src=".\assets\" alt="weapon_deagle" />

  weapon_usp:     null,
  // <img width="67" height="67" src=".\assets\" alt="weapon_usp" />

  weapon_glock:   <img width="67" height="67" src=".\assets\glock.png" alt="weapon_glock" />,

  weapon_famas:   <img width="67" height="67" src=".\assets\famas.png" alt="weapon_famas" />,

  weapon_galil:   null,
  // <img width="67" height="67" src=".\assets\" alt="weapon_galil" />

  weapon_ssg08:   <img width="67" height="67" src=".\assets\sniper.png" alt="weapon_ssg08" />,

  weapon_mac10:   <img width="67" height="67" src=".\assets\mac-mejorada.png" alt="weapon_mac10" />,

  weapon_mp9:     <img width="67" height="67" src=".\assets\mp9.png" alt="weapon_mp9" />,

  weapon_mp7:     <img width="67" height="67" src=".\assets\mp7.png" alt="weapon_mp7" />,

  weapon_negev:   null,
  // <img width="67" height="67" src=".\assets\" alt="weapon_negev" />

  weapon_sawedoff: <img width="67" height="67" src=".\assets\recortada.png" alt="weapon_sawedoff" />,
}

// ── Fallback SVG genérico ─────────────────────────────────
// Se usa cuando MEDAL_IMAGES[id] === null

function FallbackIcon({ color, size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="16" cy="16" r="10"
        stroke={color}
        strokeWidth="1.3"
        fill={color}
        fillOpacity="0.1"
      />
      <line x1="16" y1="11" x2="16" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="11" y1="16" x2="21" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── Wrapper con tint de color del jugador ─────────────────

function ImageIcon({ img, color, size }) {
  return (
    <span
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        width:          size,
        height:         size,
        filter: `drop-shadow(0 0 6px ${color}88)`,
        flexShrink:     0,
      }}
    >
      {img && (
        <img
          src={img.props.src}
          alt={img.props.alt}
          width={size}
          height={size}
          style={{ objectFit: 'contain', display: 'block' }}
        />
      )}
    </span>
  )
}

// ── Componente principal ──────────────────────────────────

export function MedalIcon({ id, color = 'currentColor', size = 28 }) {
  const img = MEDAL_IMAGES[id]

  if (img) {
    return <ImageIcon img={img} color={color} size={size} />
  }

  return <FallbackIcon color={color} size={size} />
}