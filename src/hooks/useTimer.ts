import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTimerReturn {
  elapsedSeconds: number
  intervalCount: number
  currentIntervalProgress: number
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
}

export function useTimer(
  intervalSeconds: number,
  onIntervalComplete: () => void
): UseTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [intervalCount, setIntervalCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const lastIntervalTrigger = useRef(0)

  const currentIntervalProgress = (elapsedSeconds % intervalSeconds) / intervalSeconds

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => {
          const newElapsed = prev + 1

          // Check if we've completed an interval
          const intervalsPassed = Math.floor(newElapsed / intervalSeconds)
          if (intervalsPassed > lastIntervalTrigger.current) {
            lastIntervalTrigger.current = intervalsPassed
            setIntervalCount(intervalsPassed)
            onIntervalComplete()
          }

          return newElapsed
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, intervalSeconds, onIntervalComplete])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setElapsedSeconds(0)
    setIntervalCount(0)
    lastIntervalTrigger.current = 0
  }, [])

  return {
    elapsedSeconds,
    intervalCount,
    currentIntervalProgress,
    isRunning,
    start,
    pause,
    reset
  }
}
