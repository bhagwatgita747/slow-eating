import { MealRecord } from '../hooks/useMealHistory'

const MEALS_KEY = 'slow-eating-meals'
const SETTINGS_KEY = 'slow-eating-settings'

export type PacingMode = 'timer' | 'listening'

export interface Settings {
  pacingMode: PacingMode
  intervalSeconds: number
  feedbackType: 'vibration' | 'sound' | 'both'
}

export function loadMeals(): MealRecord[] {
  try {
    const stored = localStorage.getItem(MEALS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.warn('Failed to load meals:', e)
  }
  return []
}

export function saveMeals(meals: MealRecord[]): void {
  try {
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals))
  } catch (e) {
    console.warn('Failed to save meals:', e)
  }
}

export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Ensure pacingMode exists (migration from v1)
      return {
        pacingMode: parsed.pacingMode || 'timer',
        intervalSeconds: parsed.intervalSeconds || 20,
        feedbackType: parsed.feedbackType || 'both',
      }
    }
  } catch (e) {
    console.warn('Failed to load settings:', e)
  }
  return {
    pacingMode: 'timer',
    intervalSeconds: 20,
    feedbackType: 'both'
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (e) {
    console.warn('Failed to save settings:', e)
  }
}
