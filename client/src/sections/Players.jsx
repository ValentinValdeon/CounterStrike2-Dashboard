import { useReveal } from '../hooks/useReveal'
import PlayerCard from '../components/PlayerCard'
import styles from './Players.module.css'

export default function Players({ players }) {
  const ref = useReveal(0.05)

  return (
    <section className={`section ${styles.players}`} id="players">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>JUGADORES</h2>
          <p className={styles.sub}>Stats históricas totales</p>
        </header>

        <div className={`reveal ${styles.grid}`} ref={ref}>
          {players.map((p) => (
            <PlayerCard key={p.steamId} player={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
