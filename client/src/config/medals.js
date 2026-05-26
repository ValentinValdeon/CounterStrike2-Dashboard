// ═══════════════════════════════════════════════════════
//  MEDALS CONFIG
//  Los íconos ahora son SVGs en MedalIcons.jsx
//  identificados por `id`.
// ═══════════════════════════════════════════════════════

export const MEDALS = [
  {
    id: 'most_kills',
    name: 'La Parca',
    desc: 'Mayor número de kills',
    getValue: (p) => p.stats?.kills || 0,
  },
  {
    id: 'most_deaths',
    name: 'El Kamikaze',
    desc: 'Mayor número de muertes',
    getValue: (p) => p.stats?.deaths || 0,
    lower: false,
  },
  {
    id: 'best_kd',
    name: 'El Depredador',
    desc: 'Mejor K/D ratio',
    getValue: (p) => p.stats?.kd || 0,
  },
  {
    id: 'best_winrate',
    name: 'El Ganador',
    desc: 'Mejor winrate de partidas',
    getValue: (p) => p.stats?.winrate || 0,
  },
  {
    id: 'best_hs',
    name: 'Headhunter',
    desc: 'Mayor % de headshots',
    getValue: (p) => p.stats?.hsPercent || 0,
  },
  {
    id: 'best_accuracy',
    name: 'Donde pongo el ojo, pongo la bala',
    desc: 'Mejor precisión global (hits/disparos)',
    getValue: (p) => p.stats?.accuracy || 0,
  },
  {
    id: 'best_mvp_rate',
    name: 'El Protagonista',
    desc: 'Mayor % de MVPs por ronda',
    getValue: (p) => {
      const rp = p.stats?.roundsPlayed || 0
      const mvps = p.stats?.mvps || 0
      return rp > 0 ? +((mvps / rp) * 100).toFixed(2) : 0
    },
  },
  {
    id: 'most_time',
    name: 'El Coje Nunca',
    desc: 'Mayor tiempo jugando CS2',
    getValue: (p) => p.stats?.timePlayedHours || 0,
  },
  {
    id: 'best_bpk',
    name: 'El Eficiente',
    desc: 'Menos balas por kill',
    getValue: (p) => p.stats?.bulletsPerKill || 0,
    lower: true,
  },
  {
    id: 'best_adr',
    name: 'La Aplanadora',
    desc: 'Mayor daño por ronda (ADR)',
    getValue: (p) => p.stats?.adr || 0,
  },
  {
    id: 'gg_wins',
    name: 'El Coleccionista',
    desc: 'Más victorias en Carrera de Armamentos',
    getValue: (p) => p.stats?.gunGameRoundsWon || 0,
  },
  {
    id: 'pistol_wins',
    name: 'El Pistolero',
    desc: 'Más rondas de pistola ganadas',
    getValue: (p) => p.stats?.winsPistolRound || 0,
  },
  {
    id: 'most_donated',
    name: 'El Generoso',
    desc: 'Más armas donadas al equipo',
    getValue: (p) => p.stats?.weaponsDonated || 0,
  },
  {
    id: 'most_revenges',
    name: 'El Vengador',
    desc: 'Más venganzas',
    getValue: (p) => p.stats?.revenges || 0,
  },
  {
    id: 'taser_god',
    name: 'El Mago Eléctrico',
    desc: 'Más kills con Taser',
    getValue: (p) => p.stats?.killsTaser || 0,
  },
  {
    id: 'knife_god',
    name: 'El Fiambrero',
    desc: 'Más fetas de salame cortadas',
    getValue: (p) => p.stats?.weapons.knife.kills || 0,
  },
  {
    id: 'sniper_hunter',
    name: 'Sniper de Snipers',
    desc: 'Más kills contra enemigos con sniper',
    getValue: (p) => p.stats?.antiSniper || 0,
  },
  {
    id: 'enemy_weapon',
    name: 'El Oportunista',
    desc: 'Más kills con armas enemigas',
    getValue: (p) => p.stats?.killsEnemyWeapon || 0,
  },

  // ── Precisión por arma ───────────────────────────────
  {
    id: 'weapon_ak47',
    name: 'AK-47 Master',
    desc: 'Mejor precisión con AK-47',
    getValue: (p) => p.stats?.weapons?.ak47?.accuracy || 0,
  },
  {
    id: 'weapon_m4a1',
    name: 'M4A1-S Master',
    desc: 'Mejor precisión con M4A1-S',
    getValue: (p) => p.stats?.weapons?.m4a1?.accuracy || 0,
  },
  {
    id: 'weapon_awp',
    name: 'AWP Master',
    desc: 'Mejor precisión con AWP',
    getValue: (p) => p.stats?.weapons?.awp?.accuracy || 0,
  },
  {
    id: 'weapon_deagle',
    name: 'Deagle Master',
    desc: 'Mejor precisión con Desert Eagle',
    getValue: (p) => p.stats?.weapons?.deagle?.accuracy || 0,
  },
  {
    id: 'weapon_usp',
    name: 'USP-S Master',
    desc: 'Mejor precisión con USP-S',
    getValue: (p) => p.stats?.weapons?.usp?.accuracy || 0,
  },
  {
    id: 'weapon_glock',
    name: 'Glock Master',
    desc: 'Mejor precisión con Glock',
    getValue: (p) => p.stats?.weapons?.glock?.accuracy || 0,
  },
  {
    id: 'weapon_famas',
    name: 'FAMAS Master',
    desc: 'Mejor precisión con FAMAS',
    getValue: (p) => p.stats?.weapons?.famas?.accuracy || 0,
  },
  {
    id: 'weapon_galil',
    name: 'Galil-AR Master',
    desc: 'Mejor precisión con Galil-AR',
    getValue: (p) => p.stats?.weapons?.galil?.accuracy || 0,
  },
  {
    id: 'weapon_ssg08',
    name: 'SSG-08 Master',
    desc: 'Mejor precisión con SSG-08',
    getValue: (p) => p.stats?.weapons?.ssg08?.accuracy || 0,
  },
  {
    id: 'weapon_mac10',
    name: 'MAC-10 Master',
    desc: 'Mejor precisión con MAC-10',
    getValue: (p) => p.stats?.weapons?.mac10?.accuracy || 0,
  },
  {
    id: 'weapon_mp9',
    name: 'MP9 Master',
    desc: 'Mejor precisión con MP9',
    getValue: (p) => p.stats?.weapons?.mp9?.accuracy || 0,
  },
  {
    id: 'weapon_mp7',
    name: 'MP7 Master',
    desc: 'Mejor precisión con MP7',
    getValue: (p) => p.stats?.weapons?.mp7?.accuracy || 0,
  },
  {
    id: 'weapon_negev',
    name: 'Negev Master',
    desc: 'Mejor precisión con Negev',
    getValue: (p) => p.stats?.weapons?.negev?.accuracy || 0,
  },
  {
    id: 'weapon_sawedoff',
    name: 'Recortada Master',
    desc: 'Mejor precisión con Sawed-Off',
    getValue: (p) => p.stats?.weapons?.sawedoff?.accuracy || 0,
  },
]