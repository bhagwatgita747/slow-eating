import { useEffect, useCallback, useState } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useHaptics } from '../hooks/useHaptics'
import { MealRecord } from '../hooks/useMealHistory'

interface ActiveMealProps {
  intervalSeconds: number
  feedbackType: 'vibration' | 'sound' | 'both'
  onEndMeal: (meal: MealRecord) => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function ActiveMeal({ intervalSeconds, feedbackType, onEndMeal }: ActiveMealProps) {
  const [startTime] = useState(Date.now())
  const { triggerFeedback, triggerSuccess } = useHaptics(feedbackType)
  const [showPulse, setShowPulse] = useState(false)

  const handleIntervalComplete = useCallback(() => {
    triggerFeedback()
    setShowPulse(true)
    setTimeout(() => setShowPulse(false), 500)
  }, [triggerFeedback])

  const {
    elapsedSeconds,
    intervalCount,
    currentIntervalProgress,
    start,
  } = useTimer(intervalSeconds, handleIntervalComplete)

  useEffect(() => {
    start()
  }, [start])

  const handleEndMeal = () => {
    const endTime = Date.now()
    triggerSuccess()

    const meal: MealRecord = {
      id: crypto.randomUUID(),
      startTime,
      endTime,
      durationSeconds: elapsedSeconds,
      intervalCount,
      intervalSeconds,
      date: new Date().toISOString().split('T')[0]
    }

    onEndMeal(meal)
  }

  const secondsUntilNext = intervalSeconds - (elapsedSeconds % intervalSeconds)

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
      {/* Pulse overlay */}
      {showPulse && (
        <div className="absolute inset-0 bg-primary-200 animate-pulse pointer-events-none" />
      )}

      {/* Timer display */}
      <div className="text-center mb-8">
        <div className="text-6xl font-mono font-bold text-gray-800 mb-2">
          {formatTime(elapsedSeconds)}
        </div>
        <p className="text-gray-500">Meal Duration</p>
      </div>

      {/* Circular progress */}
      <div className="relative w-64 h-64 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - currentIntervalProgress)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-primary-600">{secondsUntilNext}</div>
          <div className="text-sm text-gray-500">seconds</div>
        </div>
      </div>

      {/* Interval count */}
      <div className="text-center mb-8">
        <div className="text-2xl font-semibold text-gray-700">{intervalCount}</div>
        <div className="text-sm text-gray-500">reminders sent</div>
      </div>

      {/* End meal button */}
      <button
        onClick={handleEndMeal}
        className="px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-full text-lg font-medium shadow-lg transition-colors"
      >
        End Meal
      </button>

      {/* Status */}
      <p className="mt-6 text-gray-400 text-sm">
        Reminder every {intervalSeconds} seconds
      </p>
    </div>
  )
}
