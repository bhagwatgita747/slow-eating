# Technical Context

> Technical setup, environment, and development information. For product requirements, see PRD.md.

---

## Live URLs

- **Web App**: https://slow-eating-dndy404mv-rachits-projects-da69620c.vercel.app
- **GitHub**: https://github.com/bhagwatgita747/slow-eating

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19 + Vite 7 + TypeScript |
| Styling | Tailwind CSS 3.4 |
| Native Wrapper | Capacitor 7 (Android) |
| Haptics | @capacitor/haptics |
| Storage | localStorage |
| Deployment | Vercel |
| Testing | Puppeteer |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app component with screen routing |
| `src/components/StartMeal.tsx` | Start meal screen |
| `src/components/ActiveMeal.tsx` | Active meal timer screen |
| `src/components/MealComplete.tsx` | Post-meal stats screen |
| `src/components/Settings.tsx` | Settings screen |
| `src/hooks/useTimer.ts` | Timer logic |
| `src/hooks/useHaptics.ts` | Haptic/audio feedback |
| `src/hooks/useMealHistory.ts` | Meal history management |
| `src/lib/storage.ts` | localStorage utilities |
| `capacitor.config.ts` | Capacitor configuration |
| `tests/e2e/test.js` | Puppeteer E2E tests |

---

## Environment Variables

### Local development (.env file):
```
GITHUB_TOKEN=<stored>
VERCEL_TOKEN=<stored>
```

**Note**: These are for deployment tooling only. The app itself runs 100% client-side with no server dependencies.

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run E2E tests (starts dev server automatically)
npm run test:e2e

# Run E2E tests against production
TEST_URL=https://slow-eating-dndy404mv-rachits-projects-da69620c.vercel.app npm run test:e2e

# Sync Capacitor
npx cap sync

# Open Android Studio
npx cap open android

# Deploy to Vercel
npx vercel --prod
```

---

## Project Structure

```
slow-eating/
├── src/
│   ├── components/
│   │   ├── StartMeal.tsx
│   │   ├── ActiveMeal.tsx
│   │   ├── MealComplete.tsx
│   │   └── Settings.tsx
│   ├── hooks/
│   │   ├── useTimer.ts
│   │   ├── useHaptics.ts
│   │   └── useMealHistory.ts
│   ├── lib/
│   │   └── storage.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   ├── favicon.svg
│   └── manifest.json
├── tests/
│   └── e2e/
│       └── test.js
├── tracker/              # Documentation
├── .env                  # Tokens (gitignored)
├── .gitignore
├── CLAUDE.md
├── capacitor.config.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

*Last updated: 2025-12-11*
