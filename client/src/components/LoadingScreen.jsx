import styles from './LoadingScreen.module.css'

export default function LoadingScreen() {
  return (
    <div className={styles.wrap}>
      <div className={styles.logo}>CS2</div>
      <div className={styles.skeletons}>
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
      </div>
      <p className={styles.label}>Cargando stats</p>
    </div>
  )
}
