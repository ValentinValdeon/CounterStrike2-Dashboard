import { useState } from 'react'
import styles from './Legend.module.css'

export default function LegendButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className={styles.btn} onClick={() => setOpen(true)} aria-label="Ver leyenda de estadísticas">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        <span className={styles.btnLabel}>INFO</span>
      </button>

      {open && <LegendModal onClose={() => setOpen(false)} />}
    </>
  )
}

function LegendModal({ onClose }) {
const stats = [
    { label: 'K/D', desc: 'Kills divididas por Deaths. Ej: 1.50 significa 1.5 kills por cada muerte. Por encima de 1.0 es positivo.' },
    { label: 'KILLS', desc: 'Cantidad total de bajas que hiciste. Cuenta todas las armas y métodos de kill.' },
    { label: 'DEATHS', desc: 'Cantidad total de veces que moriste. A menor número, mejor.' },
    { label: 'WINRATE', desc: 'Porcentaje de rondas ganadas sobre el total jugadas. Más del 50% significa que ganás más de lo que perdés.' },
    { label: 'HS%', desc: 'Headshot Percentage. Porcentaje de bajas con tiro a la cabeza (kill de un solo tiro). En competitivo un 30%+ está bien.' },
    { label: 'ADR', desc: 'Average Damage per Round. Daño promedio por ronda. Se calcula: daño total dividido rondas jugadas. Por encima de 100 se considera muy bueno.' },
    { label: 'MVPs', desc: 'Most Valuable Player. Cantidad de veces que fuiste el mejor jugador de la ronda. Refleja tu impacto en el equipo.' },
    { label: 'PRECISIÓN / ACC%', desc: 'Accuracy. Porcentaje de balas que aciertan sobre el total disparadas. Se calcula: balas que dan dividido balas disparadas multiplicado por 100. 20%+ es aceptable, 30%+ es excelente.' },
    { label: 'PARTIDAS', desc: 'Total de partidos jugados en matchmaking competitivo. No incluye practise ni community games.' },
    { label: 'VICTORIAS', desc: 'Cantidad de partidos ganados en competitivo.' },
    { label: 'GANADAS / PERDIDAS', desc: 'Rondas ganadas vs perdidas en competitivo. No es igual a partidos completos.' },
    { label: 'DAÑO TOTAL', desc: 'Daño acumulado que hiciste a enemigos a lo largo de todas las partidas. Se mide en unidades del juego.' },
    { label: 'C4 PLANTADOS', desc: 'Cantidad de bombas que plantaste en el mapa. Cada plant ayuda al equipo.' },
    { label: 'GRANADA HE', desc: 'Kills con granadas HE (de fragmentación). Una granada puede killear a varios.' },
    { label: 'MOLOTOV', desc: 'Kills con molotov o granadas incendiarias. Incluye el daño por fuego.' },
    { label: 'FAKAZOS', desc: 'Kills con cuchillo (knife). Incluye backstabs y kills normales. Requiere estar cerca del enemigo.' },
    { label: 'HEADSHOTS', desc: 'Cantidad total de bajas por tiro a la cabeza. Solo cuenta headshots, no body.' },
    { label: 'BLINDEADOS', desc: 'Kills a enemigos que estaban ciegos por tu flash. Solo cuenta kills de enemigos flashados.' },
    { label: 'DEFUSE', desc: 'Bombas que desactivaste correctamente. Cada defuse exitoso suma.' },
    { label: 'BALAS/KILL', desc: 'Eficiencia de disparo. Balas disparadas dividido kills. Ej: 25 significa que necesitás 25 balas en promedio para hacer un kill. A menor número, más eficiente.' },
  ]

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>LEYENDA DE ESTADÍSTICAS</h2>
          <button className={styles.close} onClick={onClose} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </header>

        <div className={styles.list}>
          {stats.map(s => (
            <div key={s.label} className={styles.item}>
              <span className={styles.itemLabel}>{s.label}</span>
              <span className={styles.itemDesc}>{s.desc}</span>
            </div>
          ))}
        </div>

        <footer className={styles.footer}>
          <p>Stats históricas CS:GO + CS2 combinadas (limitación de Valve Steam API)</p>
        </footer>
      </div>
    </div>
  )
}