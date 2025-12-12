import { useState, useEffect, useCallback } from 'react'
import { loadMeals, saveMeals } from '../lib/storage'
import { DetectionLogEntry } from './useYamnetDetection'

export interface MealRecord {
  id: string
  startTime: number
  endTime: number
  durationSeconds: number
  intervalCount: number
  intervalSeconds: number
  date: string
  detectionLog?: DetectionLogEntry[]
}

interface UseMealHistoryReturn {
  meals: MealRecord[]
  addMeal: (meal: MealRecord) => void
  getStreak: () => number
  getAverageDuration: () => number
}

export function useMealHistory(): UseMealHistoryReturn {
  const [meals, setMeals] = useState<MealRecord[]>([])

  useEffect(() => {
    const stored = loadMeals()
    setMeals(stored)
  }, [])

  const addMeal = useCallback((meal: MealRecord) => {
    setMeals(prev => {
      const updated = [meal, ...prev]
      saveMeals(updated)
      return updated
    })
  }, [])

  const getStreak = useCallback((): number => {
    if (meals.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check each day backwards
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]

      const hasMealOnDay = meals.some(m => m.date === dateStr)

      if (hasMealOnDay) {
        streak++
      } else if (i > 0) {
        // Allow skipping today if no meal yet
        break
      }
    }

    return streak
  }, [meals])

  const getAverageDuration = useCallback((): number => {
    if (meals.length === 0) return 0
    const total = meals.reduce((sum, m) => sum + m.durationSeconds, 0)
    return Math.round(total / meals.length)
  }, [meals])

  return { meals, addMeal, getStreak, getAverageDuration }
}
