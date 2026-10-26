# Architecture — Wangoz Landing Page

## 1. Technical Architecture Overview

The Wangoz landing page is a client-side Single-Page Application (SPA) built with React 19, TypeScript, Vite, Tailwind CSS v4, and GSAP. It does not employ client-side routing libraries, external state stores, or server-side rendering.

```
                           Browser Window
                                 │
                     ┌───────────▼───────────┐
                     │       index.html      │
                     └───────────┬───────────┘
                                 │
                     ┌───────────▼───────────┐
                     │      src/main.tsx     │ (StrictMode, React DOM createRoot)
                     └───────────┬───────────┘
                                 │
                     ┌───────────▼───────────┐
                     │      src/App.tsx      │
                     └───────────┬───────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
     ┌──────────▼──────────┐           ┌──────────▼──────────┐
     │ SmoothScrollProvider│           │  FloatingParticles  │
     └──────────┬──────────┘           └─────────────────────┘
                │
     ┌──────────┼─────────────────────────┐
     │          │                         │
┌────▼────┐┌────▼────────────────────┐┌───▼────┐
│  Hero   ││   ScrollyDeliveryStage  ││ Finale │
│ Section ││       (750vh Pinned)    ││ & Foot │
└─────────┘└────┬────────────────────┘└───┬────┘
                │                         │
     ┌──────────┴──────────┐   ┌──────────┴──────────┐
     │  MotionPathPlugin   │   │  ScrollTrigger CTA  │
     │  SVG Road Animation │   │  Entrance Timeline  │
     └─────────────────────┘   └─────────────────────┘
```

---

## 2. Directory & Component Structure

```
wangoz-landing-page/
├── index.html                  # HTML entry point, Google Fonts, meta tags
├── vite.config.ts              # Vite config with React and Tailwind CSS v4 plugins
├── tsconfig.json               # Root TS config referencing app and node configs
├── tsconfig.app.json           # Client app TS config (strict unused checks)
├── .oxlintrc.json              # Oxlint rules configuration
├── public/
│   ├── favicon.svg             # Browser tab favicon
│   └── icons.svg               # Unreferenced SVG sprite asset
├── src/
│   ├── main.tsx                # Application mounting point
│   ├── App.tsx                 # Top-level composition & layout
│   ├── index.css               # Global tokens, resets, Tailwind import, helper classes
│   ├── assets/                 # High-resolution raster images (PNG) & SVGs
│   │   ├── wangoz-logo.png
│   │   ├── rider.png
│   │   ├── restaurant.png
│   │   ├── grocery.png
│   │   ├── medical.png
│   │   ├── house.png
│   │   ├── hero.png            # Unused in current live render
│   │   └── vite.svg            # Default template asset
│   ├── components/
│   │   ├── ScrollyDeliveryStage.tsx  # Interactive road & GSAP timeline
│   │   └── AssetImage.tsx            # Unused placeholder SVG fallback component
│   ├── data/
│   │   └── deliveryStops.ts    # DeliveryStop data array and asset re-exports
│   └── providers/
│       └── SmoothScrollProvider.tsx  # Lenis + GSAP ticker synchronization
```

---

## 3. Scrollytelling Engine

The core technical differentiator of this project is the scroll-driven delivery experience in `src/components/ScrollyDeliveryStage.tsx`.

### 3.1 Sticky Pinning & Scroll Height
- Container: `.scroll-master` has a CSS default of `height: 700vh` in `src/index.css`, but is overridden via JSX inline style to `style={{ height: '750vh' }}` in `src/components/ScrollyDeliveryStage.tsx` to provide extended scroll dwell distance for the finale celebration overlay.
- Viewport: `.sticky-viewport` with `position: sticky; top: 0; width: 100vw; height: 100vh; contain: layout paint;`.
- ScrollTrigger pins the viewport without extra pin spacing (`pinSpacing: false`), scrubbing the master timeline from `start: 'top top'` to `end: 'bottom bottom'` with a 1-second lag smooth factor (`scrub: 1`).

### 3.2 SVG Road Geometry
The road path is an SVG cubic bezier path drawn inside a fixed virtual coordinate space (`viewBox="0 0 600 3200"`):
```typescript
const ROAD_PATH_D =
  'M 300,200 L 300,380 C 300,650 165,680 165,950 C 165,1280 435,1370 435,1700 C 435,2030 165,2120 165,2450 C 165,2730 300,2760 300,3050';
```
- **X = 300**: Central start and customer home destination.
- **X = 165**: Left curve apex (Stops 1 and 3: Restaurant and Medical).
- **X = 435**: Right curve apex (Stop 2: Grocery).

### 3.3 Rider Motion & Orientation
The rider element (`#rider-unit`) is an HTML container positioned at `(0, 0)` with `xPercent: -50, yPercent: -50`. It is animated along `#delivery-road` using GSAP's `MotionPathPlugin`:
```typescript
motionPath: {
  path: '#delivery-road',
  align: '#delivery-road',
  alignOrigin: [0.5, 0.5],
  autoRotate: true,
  start: 0.007,
  end: 0.283, // stop 1
}
```
`autoRotate: true` ensures the scooter tilts dynamically into curves.

### 3.4 Dynamic Camera Tracking
Because the virtual SVG road is 3200px tall and user viewports vary, the parent container `#camera-world` translates vertically along the Y-axis. The formula in `getCameraY`:
```typescript
const getCameraY = (targetY: number, screenFraction = 0.40) => {
  const vh = window.innerHeight || 800;
  return Math.round(vh * screenFraction - targetY);
};
```
This keeps the active stop and stopped scooter centered at ~40–46% of the screen height regardless of screen resolution.

---

## 4. Smooth Scrolling & GSAP Integration

The application uses **Lenis 1.3** coupled directly to GSAP's RequestAnimationFrame ticker in `src/providers/SmoothScrollProvider.tsx`:

```typescript
const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: true,
});

// Notify ScrollTrigger on every Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

// Drive Lenis from GSAP's ticker
const tickerCallback = (time: number) => {
  lenis.raf(time * 1000);
};
gsap.ticker.add(tickerCallback);
gsap.ticker.lagSmoothing(0);
```

**Benefits**:
1. Zero conflict between native browser momentum scroll and GSAP scrub.
2. Consistent 60 fps scrub across high-refresh displays.
3. Lenis instance is globally accessible via `(window as any).__lenis`.

---

## 5. State Management & Data Flow

There is no external state library (Redux, Zustand, etc.). State is localized:
- **`activeStepIndex` (0–5)**: Tracked inside `ScrollyDeliveryStage` via ScrollTrigger's `onUpdate(self)` callback based on `self.progress` thresholds. Updates the top HUD pill.
- **`scrollPercent` (0–100%)**: Integer percentage computed from scroll progress and rendered in the top progress badge.
- **`isStageActive`**: Boolean tracking whether the user is actively inside the scrollytelling container.
- **`deliveryStops` array**: Static configuration defined in `src/data/deliveryStops.ts`.
