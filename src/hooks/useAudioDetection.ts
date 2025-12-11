import { useState, useEffect, useCallback, useRef } from 'react'

export interface AudioDetectionState {
  isListening: boolean
  hasPermission: boolean | null
  permissionDenied: boolean
  lastBiteTime: number | null
  biteCount: number
  currentAmplitude: number
  error: string | null
}

interface UseAudioDetectionReturn extends AudioDetectionState {
  startListening: () => Promise<boolean>
  stopListening: () => void
  resetBiteCount: () => void
}

// Configuration for bite detection
const CONFIG = {
  // Amplitude threshold for detecting a "sound event" (0-1 scale)
  AMPLITUDE_THRESHOLD: 0.15,
  // Minimum time between bite detections (ms) to avoid double-counting
  MIN_BITE_INTERVAL: 2000,
  // How long a sound must persist to count as a bite (ms)
  SOUND_DURATION_THRESHOLD: 100,
  // Frequency range for eating sounds (Hz) - cutlery and chewing
  MIN_FREQUENCY: 200,
  MAX_FREQUENCY: 4000,
  // Analysis interval (ms)
  ANALYSIS_INTERVAL: 50,
}

export function useAudioDetection(
  onBiteDetected: () => void
): UseAudioDetectionReturn {
  const [state, setState] = useState<AudioDetectionState>({
    isListening: false,
    hasPermission: null,
    permissionDenied: false,
    lastBiteTime: null,
    biteCount: 0,
    currentAmplitude: 0,
    error: null,
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const soundStartTimeRef = useRef<number | null>(null)
  const lastBiteTimeRef = useRef<number>(0)

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    analyserRef.current = null
  }, [])

  // Analyze audio data
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !state.isListening) return

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)

    // Calculate amplitude in the eating frequency range
    const sampleRate = audioContextRef.current?.sampleRate || 44100
    const binSize = sampleRate / (bufferLength * 2)
    const minBin = Math.floor(CONFIG.MIN_FREQUENCY / binSize)
    const maxBin = Math.ceil(CONFIG.MAX_FREQUENCY / binSize)

    let sum = 0
    let count = 0
    for (let i = minBin; i < maxBin && i < bufferLength; i++) {
      sum += dataArray[i]
      count++
    }

    const amplitude = count > 0 ? (sum / count) / 255 : 0

    setState(prev => ({ ...prev, currentAmplitude: amplitude }))

    const now = Date.now()

    // Detect sound events
    if (amplitude > CONFIG.AMPLITUDE_THRESHOLD) {
      if (soundStartTimeRef.current === null) {
        soundStartTimeRef.current = now
      } else {
        const soundDuration = now - soundStartTimeRef.current
        const timeSinceLastBite = now - lastBiteTimeRef.current

        // If sound has persisted long enough and enough time has passed since last bite
        if (
          soundDuration >= CONFIG.SOUND_DURATION_THRESHOLD &&
          timeSinceLastBite >= CONFIG.MIN_BITE_INTERVAL
        ) {
          // Bite detected!
          lastBiteTimeRef.current = now
          soundStartTimeRef.current = null

          setState(prev => ({
            ...prev,
            lastBiteTime: now,
            biteCount: prev.biteCount + 1,
          }))

          onBiteDetected()
        }
      }
    } else {
      // Sound stopped, reset the timer
      soundStartTimeRef.current = null
    }

    // Continue analysis loop
    animationFrameRef.current = requestAnimationFrame(analyzeAudio)
  }, [state.isListening, onBiteDetected])

  // Start listening
  const startListening = useCallback(async (): Promise<boolean> => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      })

      streamRef.current = stream

      // Create audio context and analyser
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioContext = new AudioContextClass()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      setState(prev => ({
        ...prev,
        isListening: true,
        hasPermission: true,
        permissionDenied: false,
        error: null,
      }))

      // Start analysis loop
      animationFrameRef.current = requestAnimationFrame(analyzeAudio)

      return true
    } catch (err) {
      const error = err as Error
      const isDenied = error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError'

      setState(prev => ({
        ...prev,
        isListening: false,
        hasPermission: false,
        permissionDenied: isDenied,
        error: isDenied
          ? 'Microphone permission denied. Please enable it in your browser settings.'
          : `Failed to access microphone: ${error.message}`,
      }))

      cleanup()
      return false
    }
  }, [analyzeAudio, cleanup])

  // Stop listening
  const stopListening = useCallback(() => {
    cleanup()
    setState(prev => ({
      ...prev,
      isListening: false,
      currentAmplitude: 0,
    }))
  }, [cleanup])

  // Reset bite count
  const resetBiteCount = useCallback(() => {
    setState(prev => ({
      ...prev,
      biteCount: 0,
      lastBiteTime: null,
    }))
    lastBiteTimeRef.current = 0
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  // Restart analysis loop when isListening changes
  useEffect(() => {
    if (state.isListening && analyserRef.current && !animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio)
    }
  }, [state.isListening, analyzeAudio])

  return {
    ...state,
    startListening,
    stopListening,
    resetBiteCount,
  }
}
