import { useState, useRef, useCallback, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/constants'
import {
  runMockSimulation,
  type SimulationParams,
  type OracleResult,
} from '@/services/mock/oracleService'

interface UseOracleReturn {
  loading: boolean
  progress: number
  result: OracleResult | null
  error: string | null
  runSimulation: (params: SimulationParams) => Promise<void>
  reset: () => void
}

export function useOracle(): UseOracleReturn {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<OracleResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef = useRef(false)

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const startProgressSimulation = useCallback(() => {
    setProgress(0)
    let current = 0

    progressIntervalRef.current = setInterval(() => {
      if (abortRef.current) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
        return
      }

      // Accelerate early, slow down near 90%
      const increment = current < 30
        ? Math.random() * 8 + 4
        : current < 60
        ? Math.random() * 5 + 2
        : current < 85
        ? Math.random() * 3 + 0.5
        : Math.random() * 0.8 + 0.1

      current = Math.min(92, current + increment)
      setProgress(Math.round(current))
    }, 100)
  }, [])

  const stopProgressSimulation = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    setProgress(100)
  }, [])

  const runSimulation = useCallback(
    async (params: SimulationParams) => {
      setLoading(true)
      setError(null)
      setResult(null)
      abortRef.current = false

      startProgressSimulation()

      try {
        // Try real API first
        const response = await fetch(`${API_BASE_URL}/oracle/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
          signal: AbortSignal.timeout(5000),
        })

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`)
        }

        const data: OracleResult = await response.json()
        stopProgressSimulation()
        setResult(data)
      } catch {
        // Fall back to mock service
        try {
          const mockResult = await runMockSimulation(params)

          if (!abortRef.current) {
            stopProgressSimulation()
            setResult(mockResult)
          }
        } catch (mockErr) {
          stopProgressSimulation()
          setError(
            mockErr instanceof Error
              ? mockErr.message
              : 'Erro desconhecido na simulacao.'
          )
        }
      } finally {
        setLoading(false)
      }
    },
    [startProgressSimulation, stopProgressSimulation]
  )

  const reset = useCallback(() => {
    abortRef.current = true
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    setLoading(false)
    setProgress(0)
    setResult(null)
    setError(null)
  }, [])

  return { loading, progress, result, error, runSimulation, reset }
}
