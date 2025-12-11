import { useState, useEffect } from 'react'
import StartMeal from './components/StartMeal'
import ActiveMeal from './components/ActiveMeal'
import ActiveMealListening from './components/ActiveMealListening'
import MealComplete from './components/MealComplete'
import Settings, { PacingMode } from './components/Settings'
import MicrophonePermission from './components/MicrophonePermission'
import { useMealHistory, MealRecord } from './hooks/useMealHistory'
import { loadSettings } from './lib/storage'

type Screen = 'start' | 'active' | 'active-listening' | 'complete' | 'settings' | 'mic-permission'

function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [pacingMode, setPacingMode] = useState<PacingMode>('timer')
  const [intervalSeconds, setIntervalSeconds] = useState(20)
  const [feedbackType, setFeedbackType] = useState<'vibration' | 'sound' | 'both'>('both')
  const [currentMeal, setCurrentMeal] = useState<MealRecord | null>(null)
  const { meals, addMeal, getStreak } = useMealHistory()

  // Load settings on mount
  useEffect(() => {
    const settings = loadSettings()
    setPacingMode(settings.pacingMode)
    setIntervalSeconds(settings.intervalSeconds)
    setFeedbackType(settings.feedbackType)
  }, [])

  const handleStartMeal = () => {
    if (pacingMode === 'listening') {
      // Check if we need to request microphone permission
      setScreen('mic-permission')
    } else {
      setScreen('active')
    }
  }

  const handleMicPermissionGranted = () => {
    setScreen('active-listening')
  }

  const handleMicPermissionDenied = () => {
    // Fall back to timer mode
    setPacingMode('timer')
    setScreen('active')
  }

  const handleMicPermissionCancel = () => {
    // User chose to use timer mode instead
    setPacingMode('timer')
    setScreen('active')
  }

  const handleEndMeal = (mealData: MealRecord) => {
    addMeal(mealData)
    setCurrentMeal(mealData)
    setScreen('complete')
  }

  const handleNewMeal = () => {
    setCurrentMeal(null)
    setScreen('start')
  }

  const handleOpenSettings = () => {
    setScreen('settings')
  }

  const handleCloseSettings = () => {
    setScreen('start')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      {screen === 'start' && (
        <StartMeal
          onStart={handleStartMeal}
          onOpenSettings={handleOpenSettings}
          streak={getStreak()}
          totalMeals={meals.length}
          pacingMode={pacingMode}
        />
      )}

      {screen === 'mic-permission' && (
        <MicrophonePermission
          onGranted={handleMicPermissionGranted}
          onDenied={handleMicPermissionDenied}
          onCancel={handleMicPermissionCancel}
        />
      )}

      {screen === 'active' && (
        <ActiveMeal
          intervalSeconds={intervalSeconds}
          feedbackType={feedbackType}
          onEndMeal={handleEndMeal}
        />
      )}

      {screen === 'active-listening' && (
        <ActiveMealListening
          targetInterval={intervalSeconds}
          feedbackType={feedbackType}
          onEndMeal={handleEndMeal}
          onPermissionDenied={handleMicPermissionDenied}
        />
      )}

      {screen === 'complete' && currentMeal && (
        <MealComplete
          meal={currentMeal}
          streak={getStreak()}
          onNewMeal={handleNewMeal}
          pacingMode={pacingMode}
        />
      )}

      {screen === 'settings' && (
        <Settings
          pacingMode={pacingMode}
          setPacingMode={setPacingMode}
          intervalSeconds={intervalSeconds}
          setIntervalSeconds={setIntervalSeconds}
          feedbackType={feedbackType}
          setFeedbackType={setFeedbackType}
          onClose={handleCloseSettings}
        />
      )}
    </div>
  )
}

export default App
