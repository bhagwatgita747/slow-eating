import { useState } from 'react'
import StartMeal from './components/StartMeal'
import ActiveMeal from './components/ActiveMeal'
import MealComplete from './components/MealComplete'
import Settings from './components/Settings'
import { useMealHistory, MealRecord } from './hooks/useMealHistory'

type Screen = 'start' | 'active' | 'complete' | 'settings'

function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [intervalSeconds, setIntervalSeconds] = useState(20)
  const [feedbackType, setFeedbackType] = useState<'vibration' | 'sound' | 'both'>('both')
  const [currentMeal, setCurrentMeal] = useState<MealRecord | null>(null)
  const { meals, addMeal, getStreak } = useMealHistory()

  const handleStartMeal = () => {
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
        />
      )}

      {screen === 'active' && (
        <ActiveMeal
          intervalSeconds={intervalSeconds}
          feedbackType={feedbackType}
          onEndMeal={handleEndMeal}
        />
      )}

      {screen === 'complete' && currentMeal && (
        <MealComplete
          meal={currentMeal}
          streak={getStreak()}
          onNewMeal={handleNewMeal}
        />
      )}

      {screen === 'settings' && (
        <Settings
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
