# CLAUDE.md

Premium bilingual website (Bulgarian by default, English) for Sugar Nails, a nail studio in Ovcha Kupel, Sofia. The client brief lives in `brief.md`.

## Stack and commands

- Vite 8, React 19, TypeScript, Motion 13 (`motion/react`), CSS Modules, Sofia Sans Variable self-hosted through Fontsource.
- `npm run dev` · `npm run build` (typecheck, then `/` in Bulgarian and `/en/` in English) · `npm run lint` (Oxlint) · `npm run preview`.

## Where things live

- `src/salon.ts`: salon facts (address links, Studio24, Instagram, services, finishes). `null` marks a detail not yet confirmed; filling it in makes the matching UI appear.
- `src/i18n/dict.ts`: every piece of copy in both languages. `en` is typed against `bg`, so a missing key fails the build.
- `src/sections/`: page sections in reading order. `src/components/`: shared pieces. `src/lib/motion.ts`: easing and timing tokens.
- `index.html` and `en/index.html`: per-language title, description, hreflang, Open Graph and JSON-LD.

## Motion rules

- Animate with `m` components inside `LazyMotion` (`import * as m from 'motion/react-m'`). Never `motion.*`: strict mode throws.
- One easing curve (`EASE`), `reveal` for entrances, the `ui` spring for interface and layout changes. Do not add new curves.
- Subtle, intentional, in service of hierarchy and storytelling. Plain CSS for simple hover, colour and opacity changes.
- Reduced motion: `MotionConfig reducedMotion="user"` plus `useReducedMotion()` to drop scroll-linked transforms, the pinned gallery and the canvas loop.
- Mobile is its own design: cursor effects only for `(hover: hover) and (pointer: fine)`, native swipe gallery below 1024px, sticky booking bar.

## Working rules

- Inspect only the files the task needs, and do not reread unchanged files.
- Reuse existing components and utilities; no unrelated rewrites or refactors.
- Batch related changes, and keep progress updates and explanations short.
- Never invent salon facts (prices, phone, hours, reviews). Leave them `null` in `src/salon.ts` and say what is missing.
- Before finishing, test desktop, tablet and mobile in both languages, plus reduced motion.
