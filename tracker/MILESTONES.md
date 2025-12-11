# Milestones & Roadmap

> Feature backlog and prioritized roadmap.
> Auto-organized by: dependencies -> architecture -> complexity

---

## Phase 1: Timer Mode (MVP) - COMPLETE

### Milestone 1.1: Project Setup - DONE
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Create GitHub repository | Done | bhagwatgita747/slow-eating |
| 2 | Initialize React + Vite project | Done | React 19 + Vite 7 + TypeScript |
| 3 | Add Capacitor for Android | Done | Configured, not yet built |
| 4 | Set up Vercel deployment | Done | Auto-deploys on push |
| 5 | Configure Puppeteer testing | Done | 8/8 tests passing |

### Milestone 1.2-1.5 - ALL DONE
All Timer Mode features complete (see Phase 1 in git history)

---

## Phase 2: Listening Mode - COMPLETE

### Milestone 2.1: Audio Detection - DONE
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Microphone permission flow | Done | MicrophonePermission component |
| 2 | Create audio detection hook | Done | useAudioDetection.ts |
| 3 | Frequency analysis | Done | Web Audio API + AnalyserNode |
| 4 | Detect eating sounds | Done | Amplitude spike detection |

### Milestone 2.2: Intelligent Feedback - DONE
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Bite event detection | Done | Configurable thresholds |
| 2 | Pace analysis algorithm | Done | Interval between bites |
| 3 | Smart vibration triggers | Done | Only when eating too fast |

### Milestone 2.3: Mode Selection - DONE
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Settings screen with mode toggle | Done | Timer / Listening |
| 2 | Persist user preference | Done | localStorage |
| 3 | Mode indicator on start screen | Done | Shows current mode |

---

## Completed

| # | Feature | Completed |
|---|---------|-----------|
| 1 | Documentation system setup | 2025-12-11 |
| 2 | GitHub/Vercel connections | 2025-12-11 |
| 3 | GitHub repository created | 2025-12-11 |
| 4 | Phase 1 MVP (Timer Mode) | 2025-12-11 |
| 5 | E2E tests passing (8/8) | 2025-12-11 |
| 6 | Production deployment live | 2025-12-11 |
| 7 | **Phase 2 Listening Mode** | 2025-12-11 |

---

## Backlog (Unprioritized)

- [ ] Dark mode support
- [ ] Multiple meal profiles (breakfast, lunch, dinner)
- [ ] Social sharing of streaks
- [ ] Watch app companion (WearOS)
- [ ] Detailed analytics dashboard
- [ ] Export meal history
- [ ] Android APK build via Capacitor
- [ ] Custom domain for Vercel
- [ ] TensorFlow.js ML model for better detection
- [ ] Calibration mode for personalized detection

---

*Last updated: 2025-12-11*
