# Product Requirements Document (PRD)

> Slow Eating - The "Invisible" Dining Coach

---

## Objective

Help users reduce their eating speed (pace their bites) to improve satiety, digestion, and caloric control. The solution must be **non-intrusive and joyful**, functioning as a passive companion rather than a strict enforcer.

---

## Target Audience

- Health-conscious individuals looking to improve eating habits
- People trying to lose weight or manage portion control
- Users with digestive issues who benefit from slower eating
- Anyone wanting to practice mindful eating

---

## Core Solution: "Ambient Audio Pacing"

Instead of requiring users to tap buttons or stare at a camera, the app uses:
- **Phase 1 (Timer Mode)**: Simple interval timer with haptic/audio feedback
- **Phase 2 (Listening Mode)**: Smartphone microphone + on-device AI to detect eating cadence

**Key Differentiator:** The app does not demand attention; it runs in the background, allowing the user to enjoy their meal naturally.

---

## User Experience

### Phase 1: Setup (Seconds)
- User opens app and taps "Start Meal"
- App sets dynamic interval (e.g., "20 seconds between bites")
- User places phone on table; screen can dim to save battery

### Phase 2: The Meal

**Timer Mode (MVP):**
- App vibrates/beeps at set intervals as a reminder to slow down
- No detection, just periodic gentle nudges

**Listening Mode (Future):**
- App listens for eating sounds (cutlery, chewing)
- Only intervenes when detecting rapid successive bites
- Subtle haptic vibration (double-pulse) for "too fast" feedback

### Phase 3: Post-Meal Gratification
- Tap "I'm Done" to see stats:
  - **Meal Duration**: Total time eating
  - **Satiety Score**: Estimated fullness benefit
  - **Streak Tracking**: Consecutive meals paced well

---

## Technical Architecture

| Component | Technology |
|-----------|------------|
| Framework | PWA (Progressive Web App) + Capacitor |
| Platform | Android (initial release) |
| AI (Phase 2) | TensorFlow Lite (JS/WASM) with YAMNet |
| Privacy | 100% on-device, no audio leaves phone |

---

## Development Phases

### Phase 1: Timer Mode (MVP)
- Start/End meal flow
- Configurable interval (15-30 seconds)
- Haptic vibration + optional audio beep
- Basic meal stats screen
- Vercel deployment + Puppeteer testing

### Phase 2: Listening Mode
- Microphone access and audio processing
- On-device bite detection with TensorFlow.js
- Intelligent feedback only when eating too fast
- User toggle between Timer/Listening modes

---

## Success Metrics (KPIs)

| Metric | Target |
|--------|--------|
| Session Duration | Increase average meal time by 50% |
| Intervention Rate | Decrease vibrations needed per meal over time |
| Retention | Users completing 10+ logged meals |

---

## MVP Scope (Phase 1)

- [ ] Start Meal button
- [ ] Configurable timer interval
- [ ] Haptic + audio feedback
- [ ] End Meal button
- [ ] Basic stats display
- [ ] PWA installable on Android

---

## Document History

| Date | Changes |
|------|---------|
| 2025-12-11 | Initial PRD created with phased approach |
