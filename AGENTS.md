# AI Coding Agent Instructions — Wangoz Landing Page

These instructions define operational protocols, coding standards, and architectural constraints for AI coding agents modifying this repository.

---

## 1. Core Principles

1. **Investigate Before Editing**: Always inspect existing code, styles, and data structures before modifying them. Do not guess filenames, export names, or component properties.
2. **Preserve Visual Identity & Experience**: Maintain the brand palette (Yellow `#FCE869`, Blue `#2B5FE0`), typographic hierarchy (Plus Jakarta Sans), smooth 60fps scrolling, and GSAP motion orchestration.
3. **Targeted, Minimal Changes**: Implement the smallest viable diff for bugs or features. Do not perform gratuitous refactoring, rewrite functional components, or introduce unnecessary layers of abstraction.
4. **Reuse Existing Patterns**: Reuse components from `src/components/`, data models from `src/data/`, and CSS tokens from `src/index.css`.
5. **Strict TypeScript & Build Discipline**: The codebase enforces `noUnusedLocals: true`, `noUnusedParameters: true`, and `verbatimModuleSyntax: true`. Any unused variable or import will fail the production build.
6. **Mandatory Local Verification**: Always run linting (`npm run lint`) and type-checking/build (`npm run build`) before concluding any task. Never claim checks passed without executing them.

---

## 2. Repository Overview & Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (`react`, `react-dom`) |
| **Language** | TypeScript 6.0 with `erasableSyntaxOnly` and strict checks |
| **Bundler** | Vite 8 (`@vitejs/plugin-react`) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) + CSS tokens in `src/index.css` |
| **Motion** | GSAP 3 (`gsap`, `@gsap/react`, `ScrollTrigger`, `MotionPathPlugin`) |
| **Smooth Scroll** | Lenis 1.3 (`lenis`) synchronized with GSAP ticker |
| **Icons** | Lucide React (`lucide-react`) |
| **Linter** | Oxlint (`oxlint`, configured via `.oxlintrc.json`) |

Detailed documentation:
- Architecture & component relationships: [`docs/architecture.md`](docs/architecture.md)
- Design tokens & layout conventions: [`docs/design-system.md`](docs/design-system.md)
- Product features & sections: [`docs/project-overview.md`](docs/project-overview.md)
- Setup, scripts & verification: [`docs/development.md`](docs/development.md)
- Architectural decision records: [`docs/decisions.md`](docs/decisions.md)

---

## 3. Agent Workflow Checklist

When assigned a task, follow this sequential procedure:

### Phase A: Exploration & Planning
- Read relevant documentation in `docs/`.
- Locate and read the exact files you intend to edit.
- **For Bugs**: Trace or reproduce the issue through the code execution path and identify the root cause before making edits.
- **For Features**: Investigate requirements thoroughly and formulate a clear implementation plan before writing code.
- If requirements cannot be established safely from the codebase, ask the user for clarification.

### Phase B: Implementation Guardrails
- **Tailwind CSS v4**: There is no `tailwind.config.js`. Tailwind is imported via `@import "tailwindcss";` in `src/index.css`. Global CSS tokens and variables live in `:root`.
- **GSAP & React 19**: Always use `useGSAP` from `@gsap/react` or register plugins (`ScrollTrigger`, `MotionPathPlugin`) properly. Always clean up timelines via context reversion (`ctx.revert()`).
- **Lenis Smooth Scroll**: All scroll-scrubbed GSAP animations rely on the Lenis ticker bridge in `src/providers/SmoothScrollProvider.tsx`. Do not reinitialize Lenis elsewhere.
- **ScrollTrigger Geometry**: In `src/components/ScrollyDeliveryStage.tsx`, the road path `ROAD_PATH_D` is locked to SVG viewBox `0 0 600 3200`. Rider coordinates, camera pan math (`getCameraY`), and store positions are tightly coupled. Test both desktop and mobile viewports when altering any coordinate.
- **Quality & Non-Functional Criteria**: Maintain mobile responsiveness, consider accessibility (such as motion sensitivity considerations), and preserve existing performance.
- **Imports**: With `verbatimModuleSyntax: true`, type-only imports must use `import type { ... }` or `import { type ... }`.

### Phase C: Verification & Documentation
Run the verification commands and inspect the output:
```bash
# 1. Run linter
npm run lint

# 2. Run TypeScript build verification
npm run build
```
- Never claim tests or builds passed unless actually executed.
- Examine `git diff` to ensure no unintended files or accidental deletions were introduced.
- Update relevant documentation in `docs/` whenever implementation or design decisions change.

---

## 4. Specific Technical Gotchas

1. **Unused Variables Break the Build**: `tsconfig.app.json` enables `noUnusedLocals` and `noUnusedParameters`. Unlike typical setups where unused variables are warnings, `tsc -b` will fail, halting deployment. Remove or prefix unused variables appropriately.
2. **Purity Warnings in Oxlint**: Oxlint warns on impure calls during render (e.g. `new Date().getFullYear()` inside JSX). Compute dynamic values outside JSX or inside state/memoization if clean lint output is required.
3. **ScrollTrigger Mobile Alignment**: Dynamic viewport heights on mobile browsers can throw off ScrollTrigger start/end calculations. Note the `ScrollTrigger.refresh(true)` post-load listener in `ScrollyDeliveryStage.tsx`.
4. **Orphaned / Legacy Artifacts**: Note that `src/components/AssetImage.tsx`, `public/assets/`, and `public/icons.svg` are currently unused in the live app. Do not import or delete them unless explicitly requested.
