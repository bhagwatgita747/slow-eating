import { useEffect, useCallback, useState, useRef } from 'react'
import { useAudioDetection } from '../hooks/useAudioDetection'
import { useHaptics } from '../hooks/useHaptics'
import { MealRecord } from '../hooks/useMealHistory'

interface ActiveMealListeningProps {
  targetInterval: number // seconds between bites
  feedbackType: 'vibration' | 'sound' | 'both'
  onEndMeal: (meal: MealRecord) => void
  onPermissionDenied: () => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function ActiveMealListening({
  targetInterval,
  feedbackType,
  onEndMeal,
  onPermissionDenied,
}: ActiveMealListeningProps) {
  const [startTime] = useState(Date.now())
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [tooFastCount, setTooFastCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [lastBiteInterval, setLastBiteInterval] = useState<number | null>(null)
  const previousBiteTimeRef = useRef<number | null>(null)

  const { triggerFeedback, triggerSuccess } = useHaptics(feedbackType)

  const handleBiteDetected = useCallback(() => {
    const now = Date.now()

    if (previousBiteTimeRef.current !== null) {
      const interval = (now - previousBiteTimeRef.current) / 1000
      setLastBiteInterval(interval)

      // Check if eating too fast
      if (interval < targetInterval) {
        setTooFastCount(prev => prev + 1)
        setShowWarning(true)
        triggerFeedback()
        setTimeout(() => setShowWarning(false), 1000)
      }
    }

    previousBiteTimeRef.current = now
  }, [targetInterval, triggerFeedback])

  const {
    isListening,
    permissionDenied,
    biteCount,
    currentAmplitude,
    error,
    startListening,
    stopListening,
  } = useAudioDetection(handleBiteDetected)

  // Start listening on mount
  useEffect(() => {
    startListening()
    return () => stopListening()
  }, [startListening, stopListening])

  // Handle permission denied
  useEffect(() => {
    if (permissionDenied) {
      onPermissionDenied()
    }
  }, [permissionDenied, onPermissionDenied])

  // Update elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const handleEndMeal = () => {
    stopListening()
    triggerSuccess()

    const meal: MealRecord = {
      id: crypto.randomUUID(),
      startTime,
      endTime: Date.now(),
      durationSeconds: elapsedSeconds,
      intervalCount: tooFastCount, // repurpose as "too fast" count
      intervalSeconds: targetInterval,
      date: new Date().toISOString().split('T')[0],
    }

    onEndMeal(meal)
  }

  // Calculate amplitude bar width
  const amplitudePercent = Math.min(100, currentAmplitude * 200)

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-6 relative transition-colors ${showWarning ? 'bg-orange-50' : ''}`}>
      {/* Warning overlay */}
      {showWarning && (
        <div className="absolute inset-0 bg-orange-200/50 animate-pulse pointer-events-none" />
      )}

      {/* Timer display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-mono font-bold text-gray-800 mb-2">
          {formatTime(elapsedSeconds)}
        </div>
        <p className="text-gray-500">Meal Duration</p>
      </div>

      {/* Listening indicator */}
      <div className="w-64 mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-sm text-gray-600">
            {isListening ? 'Listening...' : 'Starting...'}
          </span>
        </div>

        {/* Audio level meter */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ${showWarning ? 'bg-orange-500' : 'bg-primary-500'}`}
            style={{ width: `${amplitudePercent}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-3xl font-bold text-primary-600">{biteCount}</div>
          <div className="text-sm text-gray-500">Bites Detected</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className={`text-3xl font-bold ${tooFastCount > 0 ? 'text-orange-500' : 'text-primary-600'}`}>
            {tooFastCount}
          </div>
          <div className="text-sm text-gray-500">Too Fast</div>
        </div>
      </div>

      {/* Last bite interval */}
      {lastBiteInterval !== null && (
        <div className={`text-center mb-6 px-4 py-2 rounded-full ${lastBiteInterval < targetInterval ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
          <span className="text-sm font-medium">
            Last interval: {lastBiteInterval.toFixed(1)}s
            {lastBiteInterval < targetInterval ? ' (too fast!)' : ' (good pace)'}
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* End meal button */}
      <button
        onClick={handleEndMeal}
        className="px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-full text-lg font-medium shadow-lg transition-colors"
      >
        End Meal
      </button>

      {/* Target info */}
      <p className="mt-6 text-gray-400 text-sm">
        Target: {targetInterval}+ seconds between bites
      </p>
    </div>
  )
}
