import { useMemo } from 'react'
import { MEDALS } from '../config/medals'

/**
 * Calcula el ganador de cada medalla dado el array de jugadores.
 * Solo considera jugadores con stats disponibles (perfil público).
 *
 * Retorna un array de objetos:
 * { ...medal, winner: Player | null, value: number }
 */
export function useMedals(players) {
  return useMemo(() => {
    const valid = players.filter((p) => p.stats)
    if (valid.length === 0) return []

    return MEDALS.map((medal) => {
      // Ordenar: lower=true → menor valor gana, default → mayor valor gana
      const sorted = [...valid].sort((a, b) => {
        const va = medal.getValue(a)
        const vb = medal.getValue(b)
        return medal.lower ? va - vb : vb - va
      })

      const winner = sorted[0] ?? null
      const value  = winner ? medal.getValue(winner) : 0

      // Detectar empate
      const tied = sorted.filter((p) => medal.getValue(p) === value)

      return {
        ...medal,
        winner,
        value,
        isTied: tied.length > 1,
        tiedPlayers: tied,
      }
    })
  }, [players])
}
