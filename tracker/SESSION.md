# Current Session Context

> This file preserves recent conversation context.
> Update before ending a session or when context might be lost.
> Say "save session context" before closing Claude Code.

---

## Last Updated
**2025-12-12 01:30 IST**

---

## What We Were Working On

### Today (2025-12-12)

**YAMNet Implementation & Testing:**
- Upgraded audio detection from amplitude-based to ML-based (YAMNet)
- Fixed "Class 380" bug by embedding all 521 class names in `src/lib/yamnetClasses.ts`
- Added detection log feature - shows table of all detected sounds at meal end
- User tested: YAMNet detects sounds but eating sounds too subtle to reliably detect

**Research on Existing Solutions:**
- Searched GitHub and academic papers for eating/bite detection approaches
- Found that **nobody reliably detects eating via phone microphone alone**
- Most successful approach: **Wrist motion detection** (Clemson Bite Counter - 86% accuracy)
- Uses gyroscope to detect hand-to-mouth "roll" motion

**Amazfit Watch Investigation:**
- User has **Amazfit GTR 3**
- ZeppOS has Accelerometer/Gyroscope APIs (starting API Level 3.0)
- **Problem:** GTR 3 is stuck on ZeppOS 1.0 - no gyroscope API access
- GTR 3 won't get ZeppOS 3.0 update (only GTR 4+ gets it)
- Would need GTR 4, GTS 4, or Balance for wrist-motion bite detection

### Previous (2025-12-11)
- Set up complete documentation/tracker system
- Connected GitHub (bhagwatgita747) and Vercel (rachit)
- Created GitHub repository: slow-eating
- Completed Phase 1 (Timer Mode) and Phase 2 (Listening Mode)

---

## Current State of Approaches

| Approach | Status | Verdict |
|----------|--------|---------|
| Timer Mode | ✅ Working | Reliable, no detection needed |
| Audio (Amplitude) | ❌ Failed | Too noisy, unreliable |
| Audio (YAMNet ML) | ⚠️ Partially works | Eating sounds too subtle for phone mic |
| Intentional Tap | 🔄 Not implemented | User feels not sustainable |
| Smartwatch (GTR 3) | ❌ Not possible | ZeppOS 1.0 lacks gyroscope API |
| Smartwatch (GTR 4+) | ✅ Possible | Requires watch upgrade |

---

## Open Items / Next Steps

**User needs to decide:**
- [ ] Upgrade to GTR 4/GTS 4/Balance for wrist-motion detection
- [ ] Or use Timer Mode only (already working)
- [ ] Or try intentional tap approach (simple frequency detection)

**If upgrading watch:**
- [ ] Build ZeppOS app for GTR 4+ with gyroscope bite detection
- [ ] Implement Bluetooth communication between watch and phone app
- [ ] Port Clemson Bite Counter algorithm (wrist roll detection)

**Other pending:**
- [ ] Build Android APK via Capacitor
- [ ] Add custom domain to Vercel deployment

---

## Live URLs

- **Production**: https://slow-eating-hx0xuozun-rachits-projects-da69620c.vercel.app
- **GitHub**: https://github.com/bhagwatgita747/slow-eating

---

## Research Findings

### Existing Solutions (GitHub/Academic)

| Solution | Approach | Accuracy | Link |
|----------|----------|----------|------|
| Clemson Bite Counter | Wrist gyroscope (roll motion) | 86% sensitivity | [Project](https://cecas.clemson.edu/~ahoover/bite-counter/) |
| Real-Time Sound Detection | YAMNet (same as ours) | Noisy | [GitHub](https://github.com/robertanto/Real-Time-Sound-Event-Detection) |
| Chewing Detection Challenge | Audio + PPG + Accelerometer | Research only | [GitHub](https://github.com/mug-auth/chewing-detection-challenge) |
| MDPI Smartwatch Study | Accelerometer + Gyroscope | F1: 0.82 | [Paper](https://www.mdpi.com/1424-8220/21/5/1902) |

### Key Insight
**Nobody reliably detects eating via phone microphone alone.** Successful approaches use:
- Wrist motion sensors (gyroscope) - ~85% accuracy
- Or intentional user action (tap/button press) - ~95%+ accuracy
- Or just timers (what most commercial apps do)

### Commercial Apps
- **Slow Eats** (iOS) - Timer-based only
- **LUMME Health** - Apple Watch bite counting via motion
- **Bite Counter** (Clemson) - Dedicated wrist device

---

## Amazfit Watch Compatibility

| Model | ZeppOS | API Level | Gyroscope API |
|-------|--------|-----------|---------------|
| **GTR 3** (user's) | 1.0 | N/A | ❌ No access |
| GTR 3 Pro | 1.0 | N/A | ❌ No access |
| **GTR 4** | 3.0+ | 3.6 | ✅ Available |
| **GTS 4** | 3.0+ | 3.6 | ✅ Available |
| **Balance** | 3.0+ | 3.7 | ✅ Available |
| Active | 3.0+ | 3.6 | ✅ Available |

**ZeppOS Sensor APIs:**
- Accelerometer: API Level 3.0+ required
- Gyroscope: API Level 3.0+ required
- Documentation: https://docs.zepp.com/docs/reference/device-app-api/newAPI/sensor/

---

## Recent Decisions Made

| Decision | Reason |
|----------|--------|
| YAMNet ML model via TF Hub | Amplitude detection failed; needed proper classification |
| Embedded 521 class names | External CSV fetch had CORS issues |
| Added detection log | Debugging what sounds are detected |
| **Audio approach not viable** | User testing showed eating sounds too subtle |
| **GTR 3 not viable** | ZeppOS 1.0 doesn't expose gyroscope API |

---

## Files Changed This Session

- `src/lib/yamnetClasses.ts` - NEW: All 521 YAMNet class names
- `src/hooks/useYamnetDetection.ts` - Added detection log, use embedded class names
- `src/hooks/useMealHistory.ts` - Added detectionLog to MealRecord
- `src/components/ActiveMealListening.tsx` - Pass detection log on meal end
- `src/components/MealComplete.tsx` - Show detection log table

---

## Audio Detection Config

Located in `src/hooks/useYamnetDetection.ts`:

```typescript
// Keywords to match eating-related sounds
const EATING_CLASS_KEYWORDS = [
  'chewing', 'mastication', 'biting', 'crunch',
  'eating', 'drinking', 'sipping',
  'cutlery', 'silverware', 'dishes', 'pots', 'pans',
]

const MIN_BITE_INTERVAL = 3000  // ms between detections
const CONFIDENCE_THRESHOLD = 0.3  // 30% minimum confidence
```

YAMNet model: ~16MB, cached in IndexedDB after first load.

---

## Notes

- All 8 E2E tests pass on production
- Vercel auto-deploys on push to main branch
- User's GTR 3 cannot be used for wrist-motion detection (ZeppOS 1.0 limitation)
- Next session: Decide on approach (upgrade watch vs timer-only vs tap)
