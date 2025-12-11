# Technical Context

> Technical setup, environment, and development information. For product requirements, see PRD.md.

---

## Live URLs

- **Web App**: (Pending Vercel deployment)
- **GitHub**: https://github.com/bhagwatgita747/slow-eating

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Native Wrapper | Capacitor (Android) |
| Haptics | @capacitor/haptics |
| Storage | localStorage (Phase 1) |
| AI (Phase 2) | TensorFlow.js + YAMNet |
| Deployment | Vercel |
| Testing | Puppeteer |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app component |
| `src/components/` | UI components |
| `src/hooks/` | Custom React hooks |
| `capacitor.config.ts` | Capacitor configuration |
| `vite.config.ts` | Vite build configuration |

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

# Sync Capacitor
npx cap sync

# Open Android Studio
npx cap open android

# Run Puppeteer tests
npm run test:e2e

# Deploy to Vercel
npx vercel --prod
```

---

## Project Structure (Target)

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
│   └── main.tsx
├── public/
├── android/              # Capacitor Android project
├── tests/
│   └── e2e/              # Puppeteer tests
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
