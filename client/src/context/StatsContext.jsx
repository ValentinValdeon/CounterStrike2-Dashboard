import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const StatsContext = createContext(null)

export function StatsProvider({ children }) {
  const [players, setPlayers]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [lastFetch, setLastFetch] = useState(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get('/api/stats')
      setPlayers(data)
      setLastFetch(new Date())
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  return (
    <StatsContext.Provider value={{ players, loading, error, refetch: fetchStats, lastFetch }}>
      {children}
    </StatsContext.Provider>
  )
}

export function useStats() {
  return useContext(StatsContext)
}
