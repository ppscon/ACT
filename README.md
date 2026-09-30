# ACT Training

Independent ACT-style cognitive practice, built with React, TypeScript, Tailwind CSS and Lucide icons.

## Run locally

```sh
npm install
npm run dev
```

## Features

- Four procedural modules: deductive ordering, number fluency, error detection and spatial rules.
- Strict stimulus / assessment stages. Stimuli unmount before answer controls appear.
- Timed 20-question exams, with five questions per module in mixed sessions.
- Endless practice with optional instant feedback and explanations.
- Configurable 5–10 second memorisation and 4–8 second assessment windows. Module defaults are 7 seconds, except 6 seconds for error detection and 4 seconds for magnitude comparisons.
- Keyboard shortcuts, optional synthesized audio, responsive layouts and reduced-motion support.
- Local settings, last 50 sessions, accuracy, response latency, category breakdown and full answer review.
- Optional browser WebMCP start-session and read-progress tools, with input validation and active-session protection.

## Verify

```sh
node node_modules/typescript/bin/tsc --noEmit
node scripts/verify-training.mjs
npm run build
```

The verification script checks 4,000 generated questions, balanced mixed blocks, unique spatial solutions, timeout handling, duplicate-answer guards, feedback transitions, and score calculations.

## Scoring

Practice bands use illustrative accuracy thresholds (60% standard, 80% technical). They are not official ACT grades or evidence of trade eligibility. This app has no affiliation with the British Army.

Browser storage is local to the device and browser. There is no cloud account or cross-device synchronisation. Unavailable storage falls back to in-memory history for the visit.
