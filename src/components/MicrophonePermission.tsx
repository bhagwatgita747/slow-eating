interface MicrophonePermissionProps {
  onGranted: () => void
  onDenied: () => void
  onCancel: () => void
}

export default function MicrophonePermission({
  onGranted,
  onDenied,
  onCancel,
}: MicrophonePermissionProps) {
  const handleRequestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop())
      onGranted()
    } catch (err) {
      const error = err as Error
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        onDenied()
      } else {
        onDenied()
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* Microphone icon */}
      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Microphone Access</h1>
      <p className="text-gray-500 text-center mb-8 max-w-xs">
        Listening Mode needs microphone access to detect eating sounds and help pace your meal.
      </p>

      {/* Privacy note */}
      <div className="bg-primary-50 rounded-xl p-4 w-full max-w-sm mb-8">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-primary-800 font-medium text-sm">100% Private</p>
            <p className="text-primary-700 text-xs mt-1">
              Audio is analyzed on your device only. Nothing is recorded or sent anywhere.
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={handleRequestPermission}
          className="w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-lg font-medium shadow-lg transition-colors"
        >
          Enable Microphone
        </button>
        <button
          onClick={onCancel}
          className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-base font-medium transition-colors"
        >
          Use Timer Mode Instead
        </button>
      </div>
    </div>
  )
}
