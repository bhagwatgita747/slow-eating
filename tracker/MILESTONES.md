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

## Phase 2: Listening Mode - ATTEMPTED, NOT VIABLE

### Milestone 2.1: Audio Detection - DONE (but not reliable)
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Microphone permission flow | Done | MicrophonePermission component |
| 2 | Amplitude-based detection | Done | useAudioDetection.ts - FAILED in testing |
| 3 | YAMNet ML model | Done | useYamnetDetection.ts - eating sounds too subtle |
| 4 | Detection log for debugging | Done | Shows all detected sounds at meal end |

### Research Findings (2025-12-12)
| Finding | Details |
|---------|---------|
| Audio detection not viable | Phone mic can't reliably detect eating sounds |
| Industry standard | Nobody uses phone audio alone for bite detection |
| Best approach | Wrist motion (gyroscope) - 86% accuracy |
| Alternative | Intentional tap/ping - user rejected as "not sustainable" |

---

## Phase 3: Smartwatch Bite Detection - BLOCKED

### Blocker: User's Watch Incompatible
| Item | Details |
|------|---------|
| User's watch | Amazfit GTR 3 |
| ZeppOS version | 1.0 (stuck, no updates) |
| Gyroscope API | Requires ZeppOS 3.0+ |
| **Status** | ❌ Cannot proceed without watch upgrade |

### Compatible Watches (if user upgrades)
- Amazfit GTR 4 (ZeppOS 3.6)
- Amazfit GTS 4 (ZeppOS 3.6)
- Amazfit Balance (ZeppOS 3.7)

### If Watch Upgraded - Planned Tasks
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Set up ZeppOS development environment | Pending | Node.js + Zeus CLI |
| 2 | Create watch app with gyroscope access | Pending | Detect wrist roll motion |
| 3 | Port Clemson Bite Counter algorithm | Pending | Academic paper available |
| 4 | Bluetooth communication to phone | Pending | ZeppOS Messaging API |
| 5 | Update phone app to receive bite events | Pending | React + BLE |

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
| 7 | Phase 2 Listening Mode (code complete) | 2025-12-11 |
| 8 | YAMNet ML implementation | 2025-12-12 |
| 9 | Detection log feature | 2025-12-12 |
| 10 | Research: existing solutions | 2025-12-12 |
| 11 | Research: Amazfit compatibility | 2025-12-12 |

---

## Current Options for User

| Option | Effort | Reliability | Notes |
|--------|--------|-------------|-------|
| **Timer Mode only** | None | 100% | Already working |
| **Upgrade watch** (GTR 4+) | $150-200 + dev | ~85% | Best long-term solution |
| **Intentional tap** | Low | ~95% | User rejected |

---

## Backlog (Unprioritized)

- [ ] Dark mode support
- [ ] Multiple meal profiles (breakfast, lunch, dinner)
- [ ] Social sharing of streaks
- [ ] Detailed analytics dashboard
- [ ] Export meal history
- [ ] Android APK build via Capacitor
- [ ] Custom domain for Vercel

---

*Last updated: 2025-12-12*
