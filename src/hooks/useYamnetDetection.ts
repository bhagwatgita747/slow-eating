import { useState, useEffect, useCallback, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import { YAMNET_CLASS_NAMES } from '../lib/yamnetClasses'

export interface DetectionLogEntry {
  timestamp: number
  elapsedSeconds: number
  className: string
  confidence: number
  isEatingSound: boolean
  countedAsBite: boolean
}

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
  getDetectionLog: () => DetectionLogEntry[]
  clearDetectionLog: () => void
}

// YAMNet class names related to eating (partial matches allowed)
const EATING_CLASS_KEYWORDS = [
  'chewing',
  'mastication',
  'biting',
  'crunch',
  'eating',
  'drinking',
  'sipping',
  'cutlery',
  'silverware',
  'dishes',
  'pots',
  'pans',
]

// Minimum time between bite detections (ms)
const MIN_BITE_INTERVAL = 3000

// Confidence threshold for detection
const CONFIDENCE_THRESHOLD = 0.3

// YAMNet model URL from TensorFlow Hub
const YAMNET_MODEL_URL = 'https://tfhub.dev/google/tfjs-model/yamnet/tfjs/1'

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
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const lastBiteTimeRef = useRef<number>(0)
  const isProcessingRef = useRef<boolean>(false)
  const detectionLogRef = useRef<DetectionLogEntry[]>([])
  const startTimeRef = useRef<number>(0)

  // Load YAMNet model
  const loadModel = useCallback(async () => {
    if (modelRef.current || state.isLoadingModel) return

    setState(prev => ({ ...prev, isLoadingModel: true, error: null }))

    try {
      await tf.ready()

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
  }, [state.isLoadingModel])

  // Check if class name is eating-related
  const isEatingRelated = useCallback((className: string): boolean => {
    const lowerName = className.toLowerCase()
    return EATING_CLASS_KEYWORDS.some(keyword => lowerName.includes(keyword))
  }, [])

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

      // Get class name from embedded list
      const className = YAMNET_CLASS_NAMES[maxIndex] || `Unknown (${maxIndex})`

      // Check if it's an eating-related sound
      const isEatingSound = isEatingRelated(className)

      setState(prev => ({
        ...prev,
        detectedClass: className,
        confidence: maxScore,
      }))

      // Determine if this counts as a bite
      const now = Date.now()
      const timeSinceLastBite = now - lastBiteTimeRef.current
      const countedAsBite = isEatingSound &&
        maxScore > CONFIDENCE_THRESHOLD &&
        timeSinceLastBite >= MIN_BITE_INTERVAL

      // Log all detections with confidence > 10% (for debugging)
      if (maxScore > 0.1) {
        const logEntry: DetectionLogEntry = {
          timestamp: now,
          elapsedSeconds: Math.floor((now - startTimeRef.current) / 1000),
          className,
          confidence: maxScore,
          isEatingSound,
          countedAsBite,
        }
        detectionLogRef.current.push(logEntry)
      }

      // If eating sound detected with sufficient confidence
      if (countedAsBite) {
        lastBiteTimeRef.current = now
        setState(prev => ({
          ...prev,
          lastBiteTime: now,
          biteCount: prev.biteCount + 1,
        }))
        onBiteDetected()
      }

      // Cleanup tensors
      inputTensor.dispose()
      result.forEach(t => t.dispose())
    } catch (e) {
      console.warn('Audio processing error:', e)
    } finally {
      isProcessingRef.current = false
    }
  }, [onBiteDetected, isEatingRelated])

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

      // Reset detection log and start time
      detectionLogRef.current = []
      startTimeRef.current = Date.now()

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

  // Get detection log
  const getDetectionLog = useCallback((): DetectionLogEntry[] => {
    return [...detectionLogRef.current]
  }, [])

  // Clear detection log
  const clearDetectionLog = useCallback(() => {
    detectionLogRef.current = []
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
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
    getDetectionLog,
    clearDetectionLog,
  }
}
