# CLAUDE.md

Premium bilingual website (Bulgarian by default, English) for Sugar Nails, a nail studio in Ovcha Kupel, Sofia. The client brief lives in `brief.md`.

## Stack and commands

- Vite 8, React 19, TypeScript, Motion 13 (`motion/react`), Lenis (smooth scroll), CSS Modules, Sofia Sans Variable self-hosted through Fontsource.
- `npm run dev` · `npm run build` (typecheck, then `/` in Bulgarian and `/en/` in English) · `npm run lint` (Oxlint) · `npm run preview`.

## Where things live

- `src/salon.ts`: salon facts (phone, hours, links, Studio24 widget, rating, prices, services, gallery photos).
- `src/i18n/dict.ts`: every piece of copy in both languages. `en` is typed against `bg`, so a missing key fails the build.
- `src/sections/`: page sections in reading order. `src/components/`: shared pieces. `src/lib/motion.ts`: easing and timing tokens.
- `src/lib/scroll.ts`: Lenis smooth scroll, `scrollToTarget`, `lockScroll`/`unlockScroll`. `src/lib/crystals.ts`: crystal sprites shared by the hero nail and the page-wide dust.
- `src/assets/img/`: the salon's photos and logo as WebP (4:5 crops, `-560`/`-1040` or `-480` widths). Keep new images small and lazy-loaded.
- `index.html` and `en/index.html`: per-language title, description, hreflang, Open Graph and JSON-LD.

## Motion rules

- Animate with `m` components inside `LazyMotion` (`import * as m from 'motion/react-m'`). Never `motion.*`: strict mode throws.
- One easing curve (`EASE`), `reveal` for entrances, the `ui` spring for interface and layout changes. Do not add new curves.
- Subtle, intentional, in service of hierarchy and storytelling. Plain CSS for simple hover, colour and opacity changes.
- Reduced motion: `MotionConfig reducedMotion="user"` plus `useReducedMotion()` to drop scroll-linked transforms, the pinned gallery and the canvas loop.
- Mobile is its own design: cursor effects only for `(hover: hover) and (pointer: fine)`, native swipe gallery below 1024px, sticky booking bar.
- Smooth scrolling (Lenis) runs only for fine pointers without reduced motion. Scroll and lock the page through `src/lib/scroll.ts`, never `scrollIntoView` or `overflow: hidden` directly.
- Clip-path reveals: put `whileInView` on an unclipped parent. Chrome's IntersectionObserver counts an element's own clip-path, so a fully clipped element never enters the view.
- The `motion` skill in `.claude/skills/motion` (from secondsky/claude-skills) is general Motion reference. Where it differs, the rules above win: for example, use `m.*`, not `motion.*`.

## Working rules

- Inspect only the files the task needs, and do not reread unchanged files.
- Reuse existing components and utilities; no unrelated rewrites or refactors.
- Batch related changes, and keep progress updates and explanations short.
- Never invent salon facts (prices, phone, hours, reviews). Take them from sugarnails.beauty or Studio24, and say what is missing.
- Before finishing, test desktop, tablet and mobile in both languages, plus reduced motion.
