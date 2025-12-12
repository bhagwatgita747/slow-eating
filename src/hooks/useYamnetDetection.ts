import { useState, useEffect, useCallback, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'

export interface YamnetDetectionState {
  isListening: boolean
  isModelLoaded: boolean
  isLoadingModel: boolean
  hasPermission: boolean | null
  permissionDenied: boolean
  lastBiteTime: number | null
  biteCount: number
  detectedClass: string | null
  confidence: number
  error: string | null
}

interface UseYamnetDetectionReturn extends YamnetDetectionState {
  startListening: () => Promise<boolean>
  stopListening: () => void
  resetBiteCount: () => void
}

// YAMNet class names related to eating
const EATING_CLASSES = [
  'Chewing, mastication',
  'Biting',
  'Crunch',
  'Eating',
  'Drinking',
  'Sipping',
  'Cutlery',
  'Dishes, pots, and pans',
  'Silverware',
  'Knife',
  'Fork',
  'Spoon',
]

// Minimum time between bite detections (ms)
const MIN_BITE_INTERVAL = 3000

// Confidence threshold for detection
const CONFIDENCE_THRESHOLD = 0.3

// YAMNet model URL from TensorFlow Hub
const YAMNET_MODEL_URL = 'https://tfhub.dev/google/tfjs-model/yamnet/tfjs/1'

// YAMNet class map URL
const CLASS_MAP_URL = 'https://raw.githubusercontent.com/tensorflow/models/master/research/audioset/yamnet/yamnet_class_map.csv'

export function useYamnetDetection(
  onBiteDetected: () => void
): UseYamnetDetectionReturn {
  const [state, setState] = useState<YamnetDetectionState>({
    isListening: false,
    isModelLoaded: false,
    isLoadingModel: false,
    hasPermission: null,
    permissionDenied: false,
    lastBiteTime: null,
    biteCount: 0,
    detectedClass: null,
    confidence: 0,
    error: null,
  })

  const modelRef = useRef<tf.GraphModel | null>(null)
  const classNamesRef = useRef<string[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const lastBiteTimeRef = useRef<number>(0)
  const isProcessingRef = useRef<boolean>(false)

  // Load class names
  const loadClassNames = useCallback(async () => {
    try {
      const response = await fetch(CLASS_MAP_URL)
      const text = await response.text()
      const lines = text.trim().split('\n').slice(1) // Skip header
      classNamesRef.current = lines.map(line => {
        const parts = line.split(',')
        return parts.slice(2).join(',').replace(/"/g, '').trim()
      })
    } catch (e) {
      console.warn('Failed to load class names, using defaults:', e)
      // Fallback - YAMNet has 521 classes, but we only care about eating-related ones
      classNamesRef.current = []
    }
  }, [])

  // Load YAMNet model
  const loadModel = useCallback(async () => {
    if (modelRef.current || state.isLoadingModel) return

    setState(prev => ({ ...prev, isLoadingModel: true, error: null }))

    try {
      await tf.ready()

      // Load class names first
      await loadClassNames()

      // Load the model
      const model = await tf.loadGraphModel(YAMNET_MODEL_URL, {
        fromTFHub: true,
      })

      modelRef.current = model
      setState(prev => ({
        ...prev,
        isModelLoaded: true,
        isLoadingModel: false,
      }))

      console.log('YAMNet model loaded successfully')
    } catch (e) {
      const error = e as Error
      console.error('Failed to load YAMNet model:', error)
      setState(prev => ({
        ...prev,
        isLoadingModel: false,
        error: `Failed to load audio model: ${error.message}`,
      }))
    }
  }, [state.isLoadingModel, loadClassNames])

  // Process audio and classify
  const processAudio = useCallback(async (audioData: Float32Array) => {
    if (!modelRef.current || isProcessingRef.current) return

    isProcessingRef.current = true

    try {
      // YAMNet expects 16kHz mono audio
      // Create input tensor
      const inputTensor = tf.tensor1d(audioData)

      // Run inference
      const result = await modelRef.current.executeAsync(inputTensor) as tf.Tensor[]

      // Get scores (first output is the class scores)
      const scores = result[0]
      const scoresData = await scores.data()

      // Find top prediction
      let maxScore = 0
      let maxIndex = 0
      for (let i = 0; i < scoresData.length; i++) {
        if (scoresData[i] > maxScore) {
          maxScore = scoresData[i]
          maxIndex = i
        }
      }

      // Get class name
      const className = classNamesRef.current[maxIndex] || `Class ${maxIndex}`

      // Check if it's an eating-related sound
      const isEatingSound = EATING_CLASSES.some(ec =>
        className.toLowerCase().includes(ec.toLowerCase()) ||
        ec.toLowerCase().includes(className.toLowerCase())
      )

      setState(prev => ({
        ...prev,
        detectedClass: className,
        confidence: maxScore,
      }))

      // If eating sound detected with sufficient confidence
      if (isEatingSound && maxScore > CONFIDENCE_THRESHOLD) {
        const now = Date.now()
        const timeSinceLastBite = now - lastBiteTimeRef.current

        if (timeSinceLastBite >= MIN_BITE_INTERVAL) {
          lastBiteTimeRef.current = now
          setState(prev => ({
            ...prev,
            lastBiteTime: now,
            biteCount: prev.biteCount + 1,
          }))
          onBiteDetected()
        }
      }

      // Cleanup tensors
      inputTensor.dispose()
      result.forEach(t => t.dispose())
    } catch (e) {
      console.warn('Audio processing error:', e)
    } finally {
      isProcessingRef.current = false
    }
  }, [onBiteDetected])

  // Cleanup
  const cleanup = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }, [])

  // Start listening
  const startListening = useCallback(async (): Promise<boolean> => {
    try {
      // Load model if not loaded
      if (!modelRef.current) {
        await loadModel()
      }

      // Request microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      })

      streamRef.current = stream

      // Create audio context
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioContext = new AudioContextClass({ sampleRate: 16000 })
      audioContextRef.current = audioContext

      // Create source and processor
      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(16384, 1, 1)
      processorRef.current = processor

      // Process audio chunks
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0)
        processAudio(new Float32Array(inputData))
      }

      source.connect(processor)
      processor.connect(audioContext.destination)

      setState(prev => ({
        ...prev,
        isListening: true,
        hasPermission: true,
        permissionDenied: false,
        error: null,
      }))

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
          ? 'Microphone permission denied.'
          : `Failed to access microphone: ${error.message}`,
      }))

      cleanup()
      return false
    }
  }, [loadModel, processAudio, cleanup])

  // Stop listening
  const stopListening = useCallback(() => {
    cleanup()
    setState(prev => ({
      ...prev,
      isListening: false,
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
    return () => {
      cleanup()
      if (modelRef.current) {
        // Model cleanup if needed
      }
    }
  }, [cleanup])

  // Start loading model on mount
  useEffect(() => {
    loadModel()
  }, [loadModel])

  return {
    ...state,
    startListening,
    stopListening,
    resetBiteCount,
  }
}
