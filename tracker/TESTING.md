# Testing Checklist

> Manual test checklist for Slow Eating.
> Update status after testing. Add new cases when features are added.

---

## Last Full Test
**2025-12-11** - via Puppeteer E2E (8/8 tests passing)

---

## Status Icons
- Working - Verified working
- Broken - Known issue
- Untested - Not yet tested

---

## Automated E2E Tests (Puppeteer)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 1 | Page title is correct | Working | |
| 2 | Start Meal button exists | Working | |
| 3 | Settings button exists | Working | |
| 4 | Can start a meal | Working | |
| 5 | Timer is running | Working | |
| 6 | Can end meal and see completion | Working | |
| 7 | Can return to start screen | Working | |
| 8 | Settings screen opens | Working | |

Run tests: `npm run test:e2e`

---

## User Workflows

| # | Flow | Last Tested | Status | Notes |
|---|------|-------------|--------|-------|
| 1 | Start meal -> timer runs -> end meal | 2025-12-11 | Working | Full flow tested |
| 2 | Change interval setting | 2025-12-11 | Working | 15/20/25/30s options |
| 3 | Change feedback type | 2025-12-11 | Working | Vibration/Sound/Both |
| 4 | View meal stats after completion | 2025-12-11 | Working | Duration, intervals, score |
| 5 | Streak tracking across meals | 2025-12-11 | Untested | Need to test multiple meals |

---

## Feedback System

| # | Feature | Last Tested | Status | Notes |
|---|---------|-------------|--------|-------|
| 1 | Haptic vibration (native) | - | Untested | Requires Android device |
| 2 | Haptic vibration (web fallback) | 2025-12-11 | Working | navigator.vibrate |
| 3 | Audio beep | 2025-12-11 | Working | Web Audio API |
| 4 | Double-pulse pattern | 2025-12-11 | Working | Two quick pulses |

---

## PWA Features

| # | Feature | Last Tested | Status | Notes |
|---|---------|-------------|--------|-------|
| 1 | Manifest loads | 2025-12-11 | Working | |
| 2 | App installable | - | Untested | Requires mobile browser |
| 3 | Offline mode | - | Untested | |

---

## Storage

| # | Feature | Last Tested | Status | Notes |
|---|---------|-------------|--------|-------|
| 1 | Save meal history | 2025-12-11 | Working | localStorage |
| 2 | Load meal history | 2025-12-11 | Working | |
| 3 | Save settings | 2025-12-11 | Working | |
| 4 | Load settings | 2025-12-11 | Working | |

---

## Error Handling

| # | Scenario | Last Tested | Status | Notes |
|---|----------|-------------|--------|-------|
| 1 | localStorage unavailable | - | Untested | Falls back to in-memory |
| 2 | Audio context blocked | - | Untested | Should not break app |
| 3 | Haptics unavailable | 2025-12-11 | Working | Falls back to navigator.vibrate |

---

## Edge Cases

| # | Scenario | Last Tested | Status | Notes |
|---|----------|-------------|--------|-------|
| 1 | Very short meal (<10s) | - | Untested | |
| 2 | Very long meal (>1hr) | - | Untested | |
| 3 | App backgrounded during meal | - | Untested | Timer may pause |
| 4 | Screen locked during meal | - | Untested | |

---

## How to Add Test Cases

When a new feature is added, add test cases for:

1. **Happy path** - Normal expected usage
2. **Error scenarios** - What can go wrong?
3. **Edge cases** - Unusual but valid inputs
