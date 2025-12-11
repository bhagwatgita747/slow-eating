import { useEffect } from 'react'
import { saveSettings } from '../lib/storage'

export type PacingMode = 'timer' | 'listening'

interface SettingsProps {
  pacingMode: PacingMode
  setPacingMode: (mode: PacingMode) => void
  intervalSeconds: number
  setIntervalSeconds: (seconds: number) => void
  feedbackType: 'vibration' | 'sound' | 'both'
  setFeedbackType: (type: 'vibration' | 'sound' | 'both') => void
  onClose: () => void
}

export default function Settings({
  pacingMode,
  setPacingMode,
  intervalSeconds,
  setIntervalSeconds,
  feedbackType,
  setFeedbackType,
  onClose
}: SettingsProps) {
  // Save settings when they change
  useEffect(() => {
    saveSettings({ pacingMode, intervalSeconds, feedbackType })
  }, [pacingMode, intervalSeconds, feedbackType])

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          aria-label="Back"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-2">Settings</h1>
      </div>

      {/* Pacing Mode setting */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Pacing Mode</h2>
        <p className="text-gray-500 text-sm mb-4">
          Choose how the app helps you pace your meals
        </p>

        <div className="space-y-2">
          <button
            onClick={() => setPacingMode('timer')}
            className={`w-full p-4 rounded-xl text-left transition-colors ${
              pacingMode === 'timer'
                ? 'bg-primary-50 border-2 border-primary-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pacingMode === 'timer' ? 'bg-primary-500' : 'bg-gray-200'}`}>
                <svg className={`w-5 h-5 ${pacingMode === 'timer' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-800">Timer Mode</div>
                <div className="text-sm text-gray-500">Regular reminders at set intervals</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPacingMode('listening')}
            className={`w-full p-4 rounded-xl text-left transition-colors ${
              pacingMode === 'listening'
                ? 'bg-primary-50 border-2 border-primary-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pacingMode === 'listening' ? 'bg-primary-500' : 'bg-gray-200'}`}>
                <svg className={`w-5 h-5 ${pacingMode === 'listening' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-800">Listening Mode</div>
                <div className="text-sm text-gray-500">Detects eating sounds, alerts only when too fast</div>
              </div>
            </div>
          </button>
        </div>

        {pacingMode === 'listening' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-xs">
              Requires microphone access. Audio is processed on-device only - nothing is recorded or sent anywhere.
            </p>
          </div>
        )}
      </div>

      {/* Interval setting */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {pacingMode === 'timer' ? 'Reminder Interval' : 'Target Bite Interval'}
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          {pacingMode === 'timer'
            ? 'How often should you be reminded to slow down?'
            : 'Minimum seconds between bites before alerting'}
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">15s</span>
          <span className="text-2xl font-bold text-primary-600">{intervalSeconds}s</span>
          <span className="text-sm text-gray-500">30s</span>
        </div>

        <input
          type="range"
          min="15"
          max="30"
          step="5"
          value={intervalSeconds}
          onChange={(e) => setIntervalSeconds(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />

        <div className="flex justify-between mt-2">
          {[15, 20, 25, 30].map((val) => (
            <button
              key={val}
              onClick={() => setIntervalSeconds(val)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                intervalSeconds === val
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {val}s
            </button>
          ))}
        </div>
      </div>

      {/* Feedback type setting */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Feedback Type</h2>
        <p className="text-gray-500 text-sm mb-4">
          How should we remind you?
        </p>

        <div className="space-y-2">
          {[
            { value: 'vibration' as const, label: 'Vibration Only', desc: 'Silent, subtle pulses' },
            { value: 'sound' as const, label: 'Sound Only', desc: 'Gentle audio beeps' },
            { value: 'both' as const, label: 'Both', desc: 'Vibration + sound (recommended)' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFeedbackType(option.value)}
              className={`w-full p-4 rounded-xl text-left transition-colors ${
                feedbackType === option.value
                  ? 'bg-primary-50 border-2 border-primary-500'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <div className="font-medium text-gray-800">{option.label}</div>
              <div className="text-sm text-gray-500">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
        <p className="text-gray-500 text-sm">
          Slow Eating helps you pace your meals for better digestion and satiety.
          Place your phone on the table during meals and receive gentle reminders
          to slow down.
        </p>
        <p className="text-gray-400 text-xs mt-4">Version 2.0.0</p>
      </div>
    </div>
  )
}
