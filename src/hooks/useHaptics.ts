import { useCallback } from 'react'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

type FeedbackType = 'vibration' | 'sound' | 'both'

// Audio context for beep sound
let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioContext
}

function playBeep(frequency = 800, duration = 150, volume = 0.3): void {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration / 1000)
  } catch (e) {
    console.warn('Audio not available:', e)
  }
}

export function useHaptics(feedbackType: FeedbackType) {
  const triggerFeedback = useCallback(async () => {
    const shouldVibrate = feedbackType === 'vibration' || feedbackType === 'both'
    const shouldSound = feedbackType === 'sound' || feedbackType === 'both'

    if (shouldVibrate) {
      try {
        // Double pulse vibration pattern
        await Haptics.impact({ style: ImpactStyle.Medium })
        await new Promise(resolve => setTimeout(resolve, 100))
        await Haptics.impact({ style: ImpactStyle.Medium })
      } catch {
        // Fallback for browsers without Haptics API
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100])
        }
      }
    }

    if (shouldSound) {
      // Double beep
      playBeep(800, 100, 0.2)
      setTimeout(() => playBeep(1000, 100, 0.2), 150)
    }
  }, [feedbackType])

  const triggerSuccess = useCallback(async () => {
    try {
      await Haptics.notification({ type: NotificationType.Success })
    } catch {
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50, 30, 100])
      }
    }
    playBeep(523, 100, 0.15) // C5
    setTimeout(() => playBeep(659, 100, 0.15), 100) // E5
    setTimeout(() => playBeep(784, 150, 0.15), 200) // G5
  }, [])

  return { triggerFeedback, triggerSuccess }
}
