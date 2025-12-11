import { PacingMode } from './Settings'

interface StartMealProps {
  onStart: () => void
  onOpenSettings: () => void
  streak: number
  totalMeals: number
  pacingMode: PacingMode
}

export default function StartMeal({ onStart, onOpenSettings, streak, totalMeals, pacingMode }: StartMealProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="absolute top-4 right-4">
        <button
          onClick={onOpenSettings}
          className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          aria-label="Settings"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Logo/Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Slow Eating</h1>
        <p className="text-gray-500">Your invisible dining coach</p>
      </div>

      {/* Mode indicator */}
      <div className="flex items-center gap-2 mb-8 px-4 py-2 bg-white rounded-full shadow-sm">
        {pacingMode === 'timer' ? (
          <>
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Timer Mode</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-sm text-gray-600">Listening Mode</span>
          </>
        )}
      </div>

      {/* Stats */}
      {totalMeals > 0 && (
        <div className="flex gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">{streak}</div>
            <div className="text-sm text-gray-500">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">{totalMeals}</div>
            <div className="text-sm text-gray-500">Total Meals</div>
          </div>
        </div>
      )}

      {/* Start Button */}
      <button
        onClick={onStart}
        className="w-48 h-48 rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-2xl font-semibold shadow-lg hover:shadow-xl transition-all animate-breathe flex items-center justify-center"
      >
        Start Meal
      </button>

      {/* Instructions */}
      <p className="mt-8 text-center text-gray-400 text-sm max-w-xs">
        {pacingMode === 'timer'
          ? 'Place your phone on the table. You\'ll receive gentle reminders to pace your bites.'
          : 'Place your phone on the table. It will listen for eating sounds and alert you if you\'re eating too fast.'}
      </p>
    </div>
  )
}
