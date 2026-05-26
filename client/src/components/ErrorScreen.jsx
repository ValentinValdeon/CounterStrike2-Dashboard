import styles from './ErrorScreen.module.css'

export default function ErrorScreen({ message, onRetry }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.code}>ERROR</div>
      <p className={styles.msg}>{message}</p>
      {onRetry && (
        <button className={styles.btn} onClick={onRetry}>Reintentar</button>
      )}
    </div>
  )
}
