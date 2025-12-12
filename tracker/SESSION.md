# Current Session Context

> This file preserves recent conversation context.
> Update before ending a session or when context might be lost.
> Say "save session context" before closing Claude Code.

---

## Last Updated
**2025-12-12 00:15 IST**

---

## What We Were Working On

### Today (2025-12-12)
- Upgraded audio detection from amplitude-based to ML-based
- Implemented TensorFlow.js + YAMNet model for sound classification
- YAMNet classifies 521 audio classes including eating sounds
- UI now shows detected sound class and confidence for debugging
- All 8 E2E tests passing on production

### Previous (2025-12-11)
- Set up complete documentation/tracker system
- Connected GitHub (bhagwatgita747) and Vercel (rachit)
- Created GitHub repository: slow-eating

**Phase 1 (Timer Mode) - COMPLETE:**
- React + Vite + TypeScript + Tailwind CSS
- Capacitor configured for Android
- Full meal flow: Start -> Timer -> End -> Stats
- Haptic vibration + audio beep feedback
- Settings for interval (15-30s) and feedback type
- Local storage for meal history and streaks
- PWA manifest for Android installability

**Phase 2 (Listening Mode) - UPGRADED TO ML:**
- Mode toggle in Settings (Timer/Listening)
- ~~useAudioDetection hook with Web Audio API~~ (replaced)
- **NEW: useYamnetDetection hook with TensorFlow.js**
- YAMNet model loads from TensorFlow Hub
- Detects 12 eating-related classes: Chewing, Biting, Crunch, Cutlery, etc.
- Shows detected sound and confidence in UI for debugging
- Too-fast pace alerting with haptic/sound feedback
- Microphone permission flow with privacy messaging
- All 8 E2E tests passing on production

### Previous Session
- N/A (First session)

---

## Open Items / Next Steps

- [ ] Build Android APK via Capacitor
- [ ] Test on actual Android device (especially mic + haptics)
- [ ] Fine-tune audio detection thresholds based on real-world testing
- [ ] Consider TensorFlow.js ML model for better sound classification
- [ ] Add custom domain to Vercel deployment

---

## Live URLs

- **Production**: https://slow-eating-4c5m2mfn1-rachits-projects-da69620c.vercel.app
- **GitHub**: https://github.com/bhagwatgita747/slow-eating

---

## Recent Decisions Made

| Decision | Reason |
|----------|--------|
| ~~Web Audio API instead of ML~~ | ~~Lighter, faster, works offline without large model download~~ |
| **YAMNet ML model via TF Hub** | Amplitude detection failed in testing; ML provides proper sound classification |
| 3-second min bite interval | Prevents double-counting; increased from 2s for ML processing |
| 30% confidence threshold | Balance between sensitivity and false positives |
| Fallback to Timer Mode | If mic permission denied, gracefully falls back |

---

## Audio Detection Config

Located in `src/hooks/useYamnetDetection.ts`:

```typescript
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
```

YAMNet model loads from TensorFlow Hub (~16MB). UI shows detected class for debugging.

---

## Notes

- All 8 E2E tests pass on both local and production
- Vercel auto-deploys on push to main branch
- Both Phase 1 and Phase 2 complete
- App version updated to 2.0.0
