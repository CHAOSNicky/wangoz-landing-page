# Design System — Wangoz Landing Page

## 1. Aesthetic Identity

The Wangoz visual style combines **vibrant pop aesthetics**, **3D neo-morphic depth**, and **playful precision**. The interface is dominated by an electric sun-yellow canvas, clean white frosted glass cards, and high-saturation service accents.

---

## 2. Color Tokens

Color tokens are registered as CSS custom variables in `:root` inside `src/index.css`:

### 2.1 Brand Colors

| Token Name | Hex Value | Role / Usage |
|---|---|---|
| `--color-brand-yellow` | `#FCE869` | Global canvas background |
| `--color-brand-yellow-light` | `#FEF5B6` | Subtle yellow highlight / tints |
| `--color-brand-yellow-dark` | `#E8D45E` | Yellow borders & active states |
| `--color-brand-blue` | `#2B5FE0` | Primary brand accent, primary CTA background, road track |
| `--color-brand-blue-dark` | `#1E3FA0` | Primary CTA hover state, road 3D extrusion |
| `--color-brand-black` | `#1A1A1A` | Dark neutral, main headline text |
| `--color-brand-white` | `#FFFFFF` | Card surfaces, modal backgrounds, button labels |

### 2.2 Text Neutral Scale

| Token Name | Hex Value | Role / Usage |
|---|---|---|
| `--color-text-primary` | `#1A1A1A` | Body copy and primary headings |
| `--color-text-secondary` | `#4A4A4A` | Subtitles and supporting copy |
| `--color-text-muted` | `#7A7A7A` | Metadata, badges, and footer text |

### 2.3 Stop & Category Accents

| Category | Accent Hex | Highlight / Border Tint | Stop ID |
|---|---|---|---|
| **Hot Kitchens (Food)** | `#FF6B35` (Warm Orange) | `rgba(255, 107, 53, 0.15)` | `restaurant` |
| **Instant Grocery Mart** | `#2ECC71` (Emerald Green) | `rgba(46, 204, 113, 0.15)` | `grocery` |
| **24/7 Pharmacy & Care** | `#14B8A6` (Teal / Cyan) | `rgba(20, 184, 166, 0.15)` | `medical` |
| **Doorstep Destination** | `#2B5FE0` (Brand Blue) | `rgba(43, 95, 224, 0.15)` | `house` |

### 2.4 Glassmorphism Tokens

```css
--color-glass-bg: rgba(255, 255, 255, 0.72);
--color-glass-border: rgba(255, 255, 255, 0.5);
```
Used with `backdrop-filter: blur(24px) saturate(1.4);` to create floating frosted surfaces over the vibrant yellow canvas.

---

## 3. Typography

- **Font Family**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Weights: 200–800, normal & italic).
- **Fallbacks**: `system-ui, -apple-system, BlinkMacSystemFont, sans-serif`.

### Type Hierarchy

| Level | Size (Responsive Clamp / Tailwind) | Weight | Tracking | Usage |
|---|---|---|---|---|
| **Display Hero** | `clamp(2.1rem, 6.2vw, 5rem)` | 800 (Black) | `-0.04em` | Main hero title (`.hero-tagline`) |
| **Section Title** | `text-3xl` to `text-6xl` (`1.85rem`–`3.75rem`) | 800 (ExtraBold) | `-0.03em` | Finale & modal headlines |
| **Card Heading** | `text-xs sm:text-base` | 900 (Black) | `-0.02em` | Feature card titles |
| **Subtitle / Lead** | `clamp(0.9rem, 1.8vw, 1.15rem)` | 500 / 600 | Normal | Hero and CTA explanatory text |
| **Badge / Meta** | `text-[8.5px] sm:text-[11px]` | 700 / 900 | `+0.04em` (Uppercase) | Live indicators, service tags |

---

## 4. Spacing, Elevation & Corner Radii

### Corner Radii
```css
--radius-lg: 1.25rem;  /* 20px - Chips and compact buttons */
--radius-xl: 1.75rem;  /* 28px - Feature cards on mobile */
--radius-2xl: 2rem;    /* 32px - Desktop cards and modal containers */
```

### Elevation & Drop Shadows
```css
--shadow-card: 0 8px 40px rgba(0, 0, 0, 0.06), 0 2px 12px rgba(0, 0, 0, 0.03);
--shadow-card-hover: 0 20px 60px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.05);
--shadow-image: 0 24px 48px rgba(0, 0, 0, 0.12);
```

---

## 5. Component Patterns

### 5.1 Primary Button (`.btn-primary`)
- Pill-shaped (`border-radius: 100px`).
- Background: Brand Blue (`#2B5FE0`) with subtle blue shadow (`rgba(43, 95, 224, 0.35)`).
- Hover: Elevates by `translateY(-3px) scale(1.03)` with deepened shadow and darker blue background.

### 5.2 Secondary Button (`.btn-secondary`)
- Pill-shaped with a 2px/2.5px semi-transparent border (`rgba(26, 26, 26, 0.2)`).
- Background: Transparent with subtle white tint on hover (`rgba(255, 255, 255, 0.3)`).

### 5.3 Service Feature Card (`ServiceFeatureCard`)
- Semi-transparent glassmorphic white card (`bg-white/95 backdrop-blur-2xl`).
- Dynamic 3px accent line on top matching the stop's accent color (`stop.accentColor`).
- Contains a category badge with pulsing live dot, title, feature chips, and an action button.

### 5.4 3D Road Checkpoints
- Concentric SVG circles at each stop coordinates.
- Inner solid circle (radius 10) and outer pulsed ring (radius 26) with CSS `animate-ping` active on the current stop.

### 5.5 Legacy / Unused CSS Classes in `src/index.css`
Several classes from earlier design iterations exist in `src/index.css` but are not utilized by current components:
- `.glass-card` (superseded by `.service-feature-card` and inline backdrop blur classes)
- `.stop-section`, `.stop-image`, `.stop-badge` (superseded by scrollytelling viewport elements)
- `.highlight-item`, `.highlight-icon` (superseded by inline feature chips)
- `.float-rider-anim` (superseded by GSAP scooter micro-animation)
Do not reuse these legacy classes without verifying their styling against modern components.

---

## 6. Animation Conventions

1. **Scroll-Driven Scrubbing**: Driven by GSAP `ScrollTrigger` with `scrub: 1` over a 750vh track.
2. **Spring Entrances**: Elements animating into view frequently use `ease: 'back.out(1.5)'` for a tactile, bouncy appearance.
3. **Deceleration / Decoupling**: Entrances use `power2.out` or `power3.out`, exits use `power2.in`.
4. **Continuous Ambient Micro-Animations**:
   - Scooter vibration: `gsap.to('#rider-scooter-image', { y: '+=2', yoyo: true, repeat: -1, duration: 0.18 })`.
   - Floating particle drift: CSS keyframe `float-drift` (20s duration).
   - Live pulse beacons: Tailwind `animate-ping` and `animate-pulse`.
