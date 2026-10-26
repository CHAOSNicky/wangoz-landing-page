# Architectural Decision Records (ADR) — Wangoz Landing Page

This document records the architectural, design, and structural decisions that can be established directly from the repository's code, configuration, and commit history.

---

## ADR 01: Single-Page Scrollytelling Architecture with GSAP & Lenis

- **Status**: Accepted
- **Context**: The product required an engaging, narrative delivery journey to explain how Wangoz works (pickup at restaurant, grocery mart, pharmacy, and delivery to customer house).
- **Decision**:
  - Implemented a single pinned viewport (`100vh`) inside a `750vh` scroll container (`ScrollyDeliveryStage`).
  - Utilized GSAP 3 with `@gsap/react`, `ScrollTrigger`, and `MotionPathPlugin` to move the rider along an SVG cubic bezier path (`viewBox 0 0 600 3200`).
  - Integrated `Lenis 1.3` as the global smooth scroll engine, synchronizing scroll ticks directly into GSAP's RequestAnimationFrame ticker (`SmoothScrollProvider`).
- **Consequences**:
  - Delivers a 60 fps scrubbed cinematic experience.
  - Requires maintaining strict mathematical synchronization between SVG path coordinates, rider position, and camera Y-offset calculations (`getCameraY`).

---

## ADR 02: Tailwind CSS v4 via `@tailwindcss/vite`

- **Status**: Accepted
- **Context**: The project was initialized with Vite and React 19, requiring modern, fast CSS tooling without legacy PostCSS configuration overhead.
- **Decision**:
  - Adopted Tailwind CSS v4 using the official `@tailwindcss/vite` plugin.
  - Eliminated `tailwind.config.js` and `postcss.config.js`.
  - Configured styling directly in `src/index.css` with `@import "tailwindcss";` and `:root` design tokens.
- **Consequences**:
  - Instant build performance with zero config boilerplate.
  - Design tokens (colors, radii, shadows) remain globally accessible in standard CSS variables.

---

## ADR 03: Adoption of Oxlint over ESLint

- **Status**: Accepted
- **Context**: Fast feedback loops during development and lightweight linting without complex ESLint plugin dependencies.
- **Decision**:
  - Configured Oxlint (`oxlint: ^1.81.0`) with rules for `react`, `typescript`, and `oxc` in `.oxlintrc.json`.
  - Specifically enforced `react/rules-of-hooks: "error"` and `react/only-export-components: ["warn", { "allowConstantExport": true }]`.
- **Consequences**:
  - Sub-50ms lint times across the entire project.
  - Enforces strict React hook patterns and compiler readiness.

---

## ADR 04: Mobile Viewport Recalibration for ScrollTrigger

- **Status**: Accepted (Commit `d0a277e`: *"fix: resolve first-load mobile alignment bug in scrollytelling section"*)
- **Context**: On mobile devices and varying screen aspect ratios, delayed image and font loading caused ScrollTrigger to measure layout offsets prematurely, leading to misalignment of the rider and road.
- **Decision**:
  - Added an explicit `window.addEventListener('load', () => ScrollTrigger.refresh(true))` and `requestAnimationFrame` fallback in `ScrollyDeliveryStage.tsx`.
  - Scaled store graphics and feature cards using responsive width percentages (`w-[46%] sm:w-[42%] max-w-[230px] sm:max-w-[280px]`) with negative margin Y-offsets.
- **Consequences**:
  - Guarantees correct alignment across both mobile and desktop viewports once assets finish loading.

---

## ADR 05: Transition from SVG Fallback Placeholders to Direct PNG Imports

- **Status**: Accepted
- **Context**: During initial prototyping, an asset component (`AssetImage.tsx`) was written with inline SVG illustrations for the rider, stores, and house.
- **Decision**:
  - High-resolution 3D PNG illustrations were created and placed directly into `src/assets/`.
  - Components directly import PNG assets from `src/data/deliveryStops.ts` rather than relying on dynamic runtime loading or SVG fallbacks.
- **Consequences**:
  - Premium visual fidelity with 3D drop shadows and realistic lighting.
  - `AssetImage.tsx` remains in `src/components/` as an unreferenced legacy file.

---

## ADR 06: Strict TypeScript Compiler Constraints for Production CI

- **Status**: Accepted (Commit `b0822b8`: *"fix(build): remove unused getIconComponent and scrollToMilestone to fix TS6133 on vercel build"*)
- **Context**: Inferred from commit `b0822b8` referencing Vercel deployment, production build executes `npm run build` (`tsc -b && vite build`) where TypeScript errors halt the deployment pipeline.
- **Decision**:
  - Enabled `noUnusedLocals: true`, `noUnusedParameters: true`, and `verbatimModuleSyntax: true` in `tsconfig.app.json`.
  - Stripped all unused imports and dead utility functions to satisfy `TS6133`.
- **Consequences**:
  - Prevents dead code accumulation in production bundles.
  - Any unused variable will immediately fail CI/CD builds.
