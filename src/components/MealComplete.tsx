import { useState } from 'react'
import { MealRecord } from '../hooks/useMealHistory'
import { PacingMode } from './Settings'

interface MealCompleteProps {
  meal: MealRecord
  streak: number
  onNewMeal: () => void
  pacingMode: PacingMode
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) {
    return `${secs} seconds`
  }
  return `${mins} min ${secs} sec`
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function MealComplete({ meal, streak, onNewMeal, pacingMode }: MealCompleteProps) {
  const [showLog, setShowLog] = useState(false)

  // Calculate a simple satiety score based on duration
  // Ideal meal is 20+ minutes
  const satietyScore = Math.min(100, Math.round((meal.durationSeconds / 1200) * 100))

  // Estimate "fullness hours" - longer meals = feeling full longer
  const fullnessHours = Math.min(6, Math.round((meal.durationSeconds / 60) / 5 * 10) / 10)

  // For listening mode, intervalCount is repurposed as "too fast" count
  const tooFastCount = meal.intervalCount

  // Get detection log (only for listening mode)
  const detectionLog = meal.detectionLog || []

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* Success icon */}
      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Great Job!</h1>
      <p className="text-gray-500 mb-8">You've completed your mindful meal</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-3xl font-bold text-primary-600">
            {formatDuration(meal.durationSeconds)}
          </div>
          <div className="text-sm text-gray-500">Meal Duration</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          {pacingMode === 'listening' ? (
            <>
              <div className={`text-3xl font-bold ${tooFastCount > 0 ? 'text-orange-500' : 'text-primary-600'}`}>
                {tooFastCount}
              </div>
              <div className="text-sm text-gray-500">Too Fast Alerts</div>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-primary-600">{meal.intervalCount}</div>
              <div className="text-sm text-gray-500">Pace Reminders</div>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-3xl font-bold text-primary-600">{satietyScore}%</div>
          <div className="text-sm text-gray-500">Satiety Score</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-3xl font-bold text-primary-600">{streak}</div>
          <div className="text-sm text-gray-500">Day Streak</div>
        </div>
      </div>

      {/* Benefit message */}
      <div className="bg-primary-50 rounded-xl p-4 w-full max-w-sm mb-8">
        {pacingMode === 'listening' && tooFastCount === 0 ? (
          <p className="text-primary-800 text-center">
            Perfect pacing! You ate at a healthy pace throughout your entire meal.
          </p>
        ) : (
          <p className="text-primary-800 text-center">
            By eating mindfully for {formatDuration(meal.durationSeconds)}, you've unlocked up to <strong>{fullnessHours} hours</strong> of sustained fullness.
          </p>
        )}
      </div>

      {/* Detection log toggle (listening mode only) */}
      {pacingMode === 'listening' && detectionLog.length > 0 && (
        <button
          onClick={() => setShowLog(!showLog)}
          className="mb-4 text-sm text-primary-600 underline"
        >
          {showLog ? 'Hide' : 'Show'} Detection Log ({detectionLog.length} entries)
        </button>
      )}

      {/* Detection log table */}
      {showLog && detectionLog.length > 0 && (
        <div className="w-full max-w-md mb-6 max-h-64 overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 text-left border-b">Time</th>
                <th className="p-2 text-left border-b">Sound Detected</th>
                <th className="p-2 text-right border-b">Conf.</th>
                <th className="p-2 text-center border-b">Eating?</th>
                <th className="p-2 text-center border-b">Bite?</th>
              </tr>
            </thead>
            <tbody>
              {detectionLog.map((entry, i) => (
                <tr
                  key={i}
                  className={`${entry.countedAsBite ? 'bg-green-50' : entry.isEatingSound ? 'bg-yellow-50' : ''}`}
                >
                  <td className="p-2 border-b font-mono">{formatTime(entry.elapsedSeconds)}</td>
                  <td className="p-2 border-b truncate max-w-[150px]" title={entry.className}>
                    {entry.className}
                  </td>
                  <td className="p-2 border-b text-right">{(entry.confidence * 100).toFixed(0)}%</td>
                  <td className="p-2 border-b text-center">
                    {entry.isEatingSound ? '✓' : ''}
                  </td>
                  <td className="p-2 border-b text-center">
                    {entry.countedAsBite ? '✓' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action buttons */}
      <button
        onClick={onNewMeal}
        className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-lg font-medium shadow-lg transition-colors"
      >
        Done
      </button>
    </div>
  )
}
