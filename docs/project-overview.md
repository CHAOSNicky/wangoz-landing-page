# Project Overview — Wangoz Landing Page

## 1. Product Summary

**Wangoz** is a high-energy consumer landing page for an instant on-demand delivery service covering **Food**, **Groceries**, and **Medicines**. The tagline of the service is:

> *"Anything. Delivered. In Minutes."*

The landing page showcases speed (14–15 minute average delivery), zero surge fees, and 24/7 availability through a signature interactive scrollytelling experience.

---

## 2. Page Structure & Sections

The entire landing page is structured as a continuous vertical journey on a vibrant yellow backdrop:

```
┌────────────────────────────────────────────────────────┐
│ 1. Hero Section                                        │
│    - Wangoz 3D Logo                                    │
│    - Primary Headline & Value Proposition              │
│    - Action Buttons ("Order Now", "Explore Services")  │
│    - Floating stats bar (15 min, 500+ Cities, 24/7)    │
├────────────────────────────────────────────────────────┤
│ 2. Scrollytelling Delivery Stage (750vh)              │
│    - Sticky 100vh viewport                             │
│    - Dynamic Live HUD (status pill & progress meter)   │
│    - 3D Blue S-Curve Road (viewBox 0 0 600 3200)       │
│    - Delivery Rider traveling along path via GSAP      │
│    - Stop 1: Hot Kitchens / Food Delivery (3D Store)   │
│    - Stop 2: Farm Grocery Mart (3D Store)              │
│    - Stop 3: 24/7 Pharmacy & Urgent Care (3D Store)    │
│    - Stop 4: Customer House Doorstep                   │
│    - Celebration Overlay ("Order Arrived • Delivered") │
├────────────────────────────────────────────────────────┤
│ 3. Finale / Call to Action Section                     │
│    - House graphic illustration                        │
│    - "Ready to Wangoz?" headline                       │
│    - App download button (promo promo simulation)      │
│    - "Replay Journey" smooth-scroll trigger            │
├────────────────────────────────────────────────────────┤
│ 4. Footer                                              │
│    - Brand logo mark, copyright & service promise      │
└────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Section Breakdown

### 3.1 Hero Section
- **Location**: `src/App.tsx` (`hero-section`)
- **Key Elements**:
  - **3D Logo**: `src/assets/wangoz-logo.png` rendered with deep blue drop-shadow.
  - **Headings**: Fluid typography using `clamp(2.1rem, 6.2vw, 5rem)` with gradient accent on "In Minutes."
  - **Primary CTA (`#hero-order-btn`)**: Smooth-scrolls directly to the finale section (`#finale`).
  - **Secondary CTA (`#hero-explore-btn`)**: Smooth-scrolls to the scrollytelling container (`#delivery-experience`).
  - **Stats Pill (`StatsBar`)**: Displays 3 core metrics:
    - `15 min` (Avg delivery)
    - `500+` (Cities covered)
    - `24/7` (Always open)
  - **Ambient Background**: 5 animated floating color particles (`FloatingParticles`).

### 3.2 Scrollytelling Delivery Stage
- **Location**: `src/components/ScrollyDeliveryStage.tsx` (`.scroll-master`, 750vh height)
- **Mechanics**:
  - Pinned viewport (`position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden;`).
  - The rider travels along an SVG bezier road path (`ROAD_PATH_D`) using GSAP's `MotionPathPlugin`.
  - The camera (`#camera-world`) tracks the rider along the Y-axis via `getCameraY(targetY, screenFraction)` to keep the action centered.
  - Interactive top HUD bar updates in real-time to show the current stop and scroll percentage.
- **Service Stops**:
  1. **Hot Kitchens (Restaurant)**:
     - Checkpoint apex at Y = 950px (`X = 165px`).
     - Rider stops at Y = 1030px (`progress: 0.283`).
     - Feature card: 15-Min Prep, Zero Surge Fee.
  2. **Farm Grocery Mart**:
     - Checkpoint apex at Y = 1700px (`X = 435px`).
     - Rider stops at Y = 1780px (`progress: 0.552`).
     - Feature card: Farm-Fresh, 15-Min Slots.
  3. **24/7 Meds & Care (Pharmacy)**:
     - Checkpoint apex at Y = 2450px (`X = 165px`).
     - Rider stops at Y = 2530px (`progress: 0.821`).
     - Feature card: Verified Rx, 24/7 Dispatch.
  4. **Customer House Doorstep**:
     - Road termination at Y = 3050px (`X = 300px`).
     - Rider stops right before the house porch at Y = 2880px (`progress: 0.943`).
  5. **Celebration Modal Overlay (`#finale-brand-overlay`)**:
     - Appears as user scrolls into the final dwell section (`progress >= 0.88`).
     - Displays "Order Arrived • Delivered in 14 mins!", promotional chips, and "Download App" CTA.
     - Includes a dismiss action ("Continue scrolling to footer") allowing users to proceed to the bottom.

### 3.3 Finale & Call to Action
- **Location**: `src/App.tsx` (`#finale`)
- **Key Elements**:
  - Customer house 3D illustration (`src/assets/house.png`).
  - Conversion headline and value proposition.
  - Interactive buttons:
    - "Download App" button: triggers promo code alert dialog.
    - "Replay Journey" button: smooth-scrolls back to `#delivery-experience`.

### 3.4 Footer
- **Location**: `src/App.tsx` (`footer`)
- **Elements**: Wangoz logo mark, copyright notice with dynamic year, and brand motto.

---

## 4. User Interactions & Feedback

| Trigger | Component | Behavior |
|---|---|---|
| **Scroll / Wheel / Touch** | `SmoothScrollProvider` | Lenis smooth scroll scrubs GSAP master timeline at 60 fps. |
| **"Order Now" Button** | Hero | Calls `handleScrollToOrder()`, smooth-scrolling to `#finale`. |
| **"Explore Services" Button** | Hero | Calls `handleScrollToJourney()`, smooth-scrolling to `#delivery-experience`. |
| **"Explore Menu / Aisles / Care"** | `ServiceFeatureCard` | Hover transforms card with elevated shadow and border glow. |
| **"Download App" Button** | Stage Overlay & Finale | Invokes browser alert with promo code `WANGOZFREE`. |
| **"Dismiss Overlay" Button** | Stage Overlay | Uses GSAP to fade out `#finale-brand-overlay` (`opacity: 0, pointerEvents: 'none'`). |
| **"Replay Journey" Button** | Finale | Smooth-scrolls back to `#delivery-experience`. |
