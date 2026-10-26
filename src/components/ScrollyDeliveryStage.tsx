import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import {
  deliveryStops,
  riderImg,
  houseImg,
  logoImg,
  type DeliveryStop,
} from '../data/deliveryStops';
import {
  ArrowRight,
  Smartphone,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

/* ── Vertical Zigzag S-Curve Road Path Geometry ───────────────
   ViewBox: 0 0 600 3200
   Start:   (300, 200) -> Rider start at Y = 220
   Stop 1:  Restaurant Logo at Y = 950   (165, 950)   -> Rider stop near after at Y = 1030 (progress 0.283)
   Stop 2:  Grocery Logo at Y = 1700     (435, 1700)  -> Rider stop near after at Y = 1780 (progress 0.552)
   Stop 3:  Medical Logo at Y = 2450     (165, 2450)  -> Rider stop near after at Y = 2530 (progress 0.821)
   Stop 4:  Customer House at Y = 3050   (300, 3050)  -> Rider stop very near before at Y = 2880 (progress 0.943)
─────────────────────────────────────────────────────────────── */
const ROAD_PATH_D =
  'M 300,200 L 300,380 C 300,650 165,680 165,950 C 165,1280 435,1370 435,1700 C 435,2030 165,2120 165,2450 C 165,2730 300,2760 300,3050';

/* ── Glassmorphic Service Feature Card ──────────────────────── */
interface ServiceFeatureCardProps {
  id: string;
  stop: DeliveryStop;
  className?: string;
}

function ServiceFeatureCard({ id, stop, className = '' }: ServiceFeatureCardProps) {
  // Tailored concise feature chips per service
  const chips =
    stop.id === 'restaurant'
      ? ['⚡ 15-Min Prep', '🔥 Zero Surge Fee']
      : stop.id === 'grocery'
        ? ['🥬 Farm-Fresh', '⚡ 15-Min Slots']
        : ['🛡️ Verified Rx', '⚡ 24/7 Dispatch'];

  const shortTitle =
    stop.id === 'restaurant'
      ? 'Hot Kitchen Favorites'
      : stop.id === 'grocery'
        ? 'Daily Fresh Groceries'
        : 'Urgent Care & Meds';

  const cleanCategory =
    stop.badge.split('•')[1]?.trim() || stop.badge;

  return (
    <div
      id={id}
      className={`service-feature-card absolute z-30 bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-white/90 opacity-0 pointer-events-none transition-all duration-300 box-border overflow-hidden ${className}`}
      style={{
        boxShadow: `0 18px 40px -10px rgba(0, 0, 0, 0.12), 0 8px 24px -6px ${stop.accentColor}28`,
        borderTop: `3px solid ${stop.accentColor}`,
      }}
    >
      {/* Top Header Pill */}
      <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] sm:text-[11px] font-black uppercase tracking-wider truncate"
          style={{
            backgroundColor: `${stop.accentColor}15`,
            color: stop.accentColor,
            border: `1.5px solid ${stop.accentColor}35`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0 animate-ping"
            style={{ backgroundColor: stop.accentColor }}
          />
          <span className="truncate">{cleanCategory}</span>
        </span>
        <span className="text-[8.5px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Live
        </span>
      </div>

      {/* Concise Title */}
      <h3 className="text-xs sm:text-base font-black text-neutral-900 mb-1.5 leading-snug tracking-tight">
        {shortTitle}
      </h3>

      {/* Feature Chips Row */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-2 sm:mb-2.5">
        {chips.map((chip, idx) => (
          <span
            key={idx}
            className="inline-flex items-center px-1.5 py-0.5 sm:px-2 rounded-md text-[8.5px] sm:text-[10px] font-bold text-neutral-700 bg-neutral-100/90 border border-neutral-200/70 shadow-2xs whitespace-nowrap"
          >
            {chip}
          </span>
        ))}
      </div>

      {/* Sleek CTA Button */}
      <button
        className="w-full py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-full font-black text-[11px] sm:text-xs text-white flex items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${stop.accentColor} 0%, ${stop.accentColor}ee 100%)`,
          boxShadow: `0 6px 18px -2px ${stop.accentColor}55`,
        }}
      >
        <span>Explore {stop.id === 'restaurant' ? 'Menu' : stop.id === 'grocery' ? 'Aisles' : 'Care'}</span>
        <ArrowRight size={12} strokeWidth={2.8} />
      </button>
    </div>
  );
}

/* ── Interactive Scrollytelling Stage Component ─────────────── */
export function ScrollyDeliveryStage() {
  const masterRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const masterTlRef = useRef<gsap.core.Timeline | null>(null);

  // Active step state for HUD & Checkpoint navigation
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [isStageActive, setIsStageActive] = useState<boolean>(false);

  // Fix first-load mobile alignment: refresh ScrollTrigger after all resources
  // (images, fonts) are fully loaded so GSAP recalculates positions correctly.
  useEffect(() => {
    const handleLoad = () => {
      ScrollTrigger.refresh(true);
    };
    if (document.readyState === 'complete') {
      // Already loaded — still defer by one frame so layout is painted
      requestAnimationFrame(() => ScrollTrigger.refresh(true));
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  /* ══════════════════════════════════════════════════════════════
     GSAP useGSAP() Hook: ScrollTrigger + MotionPathPlugin Timeline
  ══════════════════════════════════════════════════════════════ */
  useGSAP(
    () => {
      // Camera position calculator function
      // Centers the target Y coordinate inside the 100vh viewport
      const getCameraY = (targetY: number, screenFraction = 0.40) => {
        const vh = window.innerHeight || 800;
        return Math.round(vh * screenFraction - targetY);
      };

      // 1. Initial State Setup:
      // Strictly centered zero-offset bounding box locked to the road at (300, 220)
      gsap.set('#rider-unit', {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: '50% 50%',
        motionPath: {
          path: '#delivery-road',
          align: '#delivery-road',
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0.007,
          end: 0.007,
        },
      });

      // Camera starts at world top (y: 0)
      gsap.set('#camera-world', { y: 0 });

      // Hide all stores and cards at initial state
      gsap.set(
        ['#store-restaurant', '#store-grocery', '#store-medical', '#store-house'],
        {
          opacity: 0,
          scale: 0.85,
        }
      );
      gsap.set(['#card-restaurant', '#card-grocery', '#card-medical'], {
        opacity: 0,
        scale: 0.9,
        pointerEvents: 'none',
      });
      gsap.set('#speed-lines', { opacity: 0 });
      gsap.set('#finale-brand-overlay', {
        opacity: 0,
        scale: 0.85,
        pointerEvents: 'none',
      });
      gsap.set('#scroll-hint', { opacity: 1 });

      // 2. Idle Scooter Micro-Animation:
      gsap.to('#rider-scooter-image', {
        y: '+=2',
        repeat: -1,
        yoyo: true,
        duration: 0.18,
        ease: 'sine.inOut',
      });

      // 3. Master timeline bound to .scroll-master
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: masterRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: viewportRef.current,
          pinSpacing: false,
          scrub: 1,
          onToggle: (self) => {
            setIsStageActive(self.isActive);
          },
          onUpdate: (self) => {
            const p = self.progress;
            setScrollPercent(Math.round(p * 100));
            if (self.isActive !== isStageActive) {
              setIsStageActive(self.isActive);
            }

            // HUD milestone indicator mapping
            if (p < 0.08) {
              setActiveStepIndex(0); // Start
            } else if (p < 0.28) {
              setActiveStepIndex(1); // Stop 1: Restaurant
            } else if (p < 0.52) {
              setActiveStepIndex(2); // Stop 2: Grocery
            } else if (p < 0.74) {
              setActiveStepIndex(3); // Stop 3: Medical
            } else if (p < 0.88) {
              setActiveStepIndex(4); // Stop 4: House (Arrived at door)
            } else {
              setActiveStepIndex(5); // Stop 5: Order Delivered!
            }
          },
        },
      });

      masterTlRef.current = masterTl;

      if (masterTl.scrollTrigger) {
        setIsStageActive(masterTl.scrollTrigger.isActive);
      }

      // Scroll hint fades out immediately (0% -> 3%)
      masterTl.to(
        '#scroll-hint',
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.out',
        },
        0
      );

      /* ════════════════════════════════════════════════════════════
         LEG 1 — Start -> Restaurant:
         - Restaurant 3D Logo is big and placed in the middle of the road at apex (X = 165, Y = 950px)
         - Rider comes down the zigzag road and stops near after the restaurant (Y = 1030px, progress 0.283)
         - Camera frames both the restaurant logo and the stopped rider
         - Dwell / Hold Zone
         - Exit: fade out store and card
      ════════════════════════════════════════════════════════════ */
      masterTl.addLabel('leg1-start', 0.3);

      // Speed lines fade in
      masterTl.to(
        '#speed-lines',
        {
          opacity: 1,
          duration: 0.35,
          ease: 'power1.out',
        },
        'leg1-start'
      );

      // Rider travels along #delivery-road (0.007 to 0.283) — stops near after restaurant
      masterTl.to(
        '#rider-unit',
        {
          motionPath: {
            path: '#delivery-road',
            align: '#delivery-road',
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0.007,
            end: 0.283,
          },
          duration: 2.5,
          ease: 'power1.inOut',
        },
        'leg1-start'
      );

      // Pan camera to frame Stop 1 in view
      masterTl.to(
        '#camera-world',
        {
          y: () => getCameraY(990, 0.44),
          duration: 2.5,
          ease: 'power1.inOut',
        },
        'leg1-start'
      );

      // Speed lines fade as rider decelerates
      masterTl.to(
        '#speed-lines',
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power1.in',
        },
        'leg1-start+=2.0'
      );

      // Restaurant store & card fade & scale in
      masterTl.fromTo(
        ['#store-restaurant', '#card-restaurant'],
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          pointerEvents: 'auto',
          ease: 'back.out(1.5)',
        },
        'leg1-start+=1.8'
      );

      // Dwell zone at restaurant
      masterTl.to({}, { duration: 2.2 });

      // Exit Restaurant
      masterTl.to(
        ['#card-restaurant', '#store-restaurant'],
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          pointerEvents: 'none',
          ease: 'power2.in',
        }
      );

      /* ════════════════════════════════════════════════════════════
         LEG 2 — Restaurant -> Grocery:
         - Grocery 3D Logo is big and placed in the middle of the road at apex (X = 435, Y = 1700px)
         - Rider travels the zigzag curve and stops near after the grocery shop (Y = 1780px, progress 0.552)
         - Camera frames grocery and stopped rider
         - Dwell / Hold Zone
         - Exit: fade out store and card
      ════════════════════════════════════════════════════════════ */
      masterTl.addLabel('leg2-start');

      masterTl.to(
        '#speed-lines',
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power1.out',
        },
        'leg2-start'
      );

      masterTl.to(
        '#rider-unit',
        {
          motionPath: {
            path: '#delivery-road',
            align: '#delivery-road',
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0.283,
            end: 0.552,
          },
          duration: 2.5,
          ease: 'power1.inOut',
        },
        'leg2-start'
      );

      masterTl.to(
        '#camera-world',
        {
          y: () => getCameraY(1740, 0.44),
          duration: 2.5,
          ease: 'power1.inOut',
        },
        'leg2-start'
      );

      masterTl.to(
        '#speed-lines',
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power1.in',
        },
        'leg2-start+=2.0'
      );

      masterTl.fromTo(
        ['#store-grocery', '#card-grocery'],
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          pointerEvents: 'auto',
          ease: 'back.out(1.5)',
        },
        'leg2-start+=1.8'
      );

      // Dwell zone at grocery
      masterTl.to({}, { duration: 2.2 });

      // Exit Grocery
      masterTl.to(
        ['#card-grocery', '#store-grocery'],
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          pointerEvents: 'none',
          ease: 'power2.in',
        }
      );

      /* ════════════════════════════════════════════════════════════
         LEG 3 — Grocery -> Medical:
         - Medical 3D Logo is big and placed in the middle of the road at apex (X = 165, Y = 2450px)
         - Rider travels the zigzag curve and stops near after the medical shop (Y = 2530px, progress 0.821)
         - Camera frames pharmacy and stopped rider
         - Dwell / Hold Zone
         - Exit: fade out store and card
      ════════════════════════════════════════════════════════════ */
      masterTl.addLabel('leg3-start');

      masterTl.to(
        '#speed-lines',
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power1.out',
        },
        'leg3-start'
      );

      masterTl.to(
        '#rider-unit',
        {
          motionPath: {
            path: '#delivery-road',
            align: '#delivery-road',
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0.552,
            end: 0.821,
          },
          duration: 2.5,
          ease: 'power1.inOut',
        },
        'leg3-start'
      );

      masterTl.to(
        '#camera-world',
        {
          y: () => getCameraY(2490, 0.44),
          duration: 2.5,
          ease: 'power1.inOut',
        },
        'leg3-start'
      );

      masterTl.to(
        '#speed-lines',
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power1.in',
        },
        'leg3-start+=2.0'
      );

      masterTl.fromTo(
        ['#store-medical', '#card-medical'],
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          pointerEvents: 'auto',
          ease: 'back.out(1.5)',
        },
        'leg3-start+=1.8'
      );

      // Dwell zone at medical
      masterTl.to({}, { duration: 2.2 });

      // Exit Medical
      masterTl.to(
        ['#card-medical', '#store-medical'],
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          pointerEvents: 'none',
          ease: 'power2.in',
        }
      );

      /* ════════════════════════════════════════════════════════════
         LEG 4 — Medical -> Customer House (Your Doorstep):
         - Customer House 3D Logo is big in the middle of the road (X = 300, Y = 3050px)
         - Rider stops VERY NEAR BEFORE the house (Y = 2880px, progress 0.943)
         - Dedicated Dwell Zone: Rider visibly parked right at the house porch
         - AND STILL THE USER SCROLLS:
           "Order arrived, Delivered" celebration part appears smoothly!
      ════════════════════════════════════════════════════════════ */
      masterTl.addLabel('leg4-start');

      masterTl.to(
        '#speed-lines',
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power1.out',
        },
        'leg4-start'
      );

      // Rider travels to doorstep — stops very near BEFORE the house at 0.943 (Y = 2880px)
      masterTl.to(
        '#rider-unit',
        {
          motionPath: {
            path: '#delivery-road',
            align: '#delivery-road',
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0.821,
            end: 0.943,
          },
          duration: 2.5,
          ease: 'power1.inOut',
        },
        'leg4-start'
      );

      // Pan camera so both the parked rider and the Customer House are centered in viewport
      masterTl.to(
        '#camera-world',
        {
          y: () => getCameraY(2965, 0.46),
          duration: 2.5,
          ease: 'power1.inOut',
        },
        'leg4-start'
      );

      masterTl.to(
        '#speed-lines',
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power1.in',
        },
        'leg4-start+=2.0'
      );

      // Customer house appears in the middle of the road right in front of the arriving rider
      masterTl.fromTo(
        '#store-house',
        { opacity: 0, scale: 0.85, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.6)',
        },
        'leg4-start+=1.8'
      );

      // Dwell zone 1: Rider is parked visibly right in front of the house
      masterTl.to({}, { duration: 2.4 });

      // And still the user scrolls: The "Order arrived, Delivered" celebration part comes!
      masterTl.addLabel('delivered-celebration');

      masterTl.fromTo(
        '#finale-brand-overlay',
        { opacity: 0, scale: 0.88, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: 'back.out(1.4)',
          pointerEvents: 'auto',
        },
        'delivered-celebration'
      );

      // Extended dwell zone for Finale overlay
      masterTl.to({}, { duration: 2.8 });
    },
    { scope: masterRef }
  );

  return (
    <div
      ref={masterRef}
      className="scroll-master relative w-full"
      style={{ height: '750vh' }}
      id="delivery-experience"
    >
      {/* ── Sticky Viewport ────────────────────────────────────── */}
      <div
        ref={viewportRef}
        className="sticky-viewport sticky top-0 w-screen h-screen overflow-hidden bg-[#FCE869] select-none flex items-center justify-center"
      >
        {/* ── Top HUD / Progress Status ────────────────────────── */}
        <header className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-40 flex items-center justify-between pointer-events-auto">
          {/* Active Status Pill */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/85 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg border border-white/60">
            <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#2B5FE0] animate-ping" />
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-neutral-800 tracking-tight">
              {activeStepIndex === 0 && '🚀 Delivery rider ready at start'}
              {activeStepIndex === 1 && '🍔 Stop 1: Picking up hot kitchen orders'}
              {activeStepIndex === 2 && '🥬 Stop 2: Loading fresh farm groceries'}
              {activeStepIndex === 3 && '💊 Stop 3: Securing urgent medicines'}
              {activeStepIndex === 4 && '🏡 Final Porch: Arrived at your doorstep!'}
              {activeStepIndex === 5 && '🎉 Order Delivered! Enjoy your Wangoz!'}
            </span>
          </div>

          {/* Scroll progress meter */}
          <div className="flex items-center gap-2 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/60 text-xs font-extrabold text-[#2B5FE0]">
            <span>{scrollPercent}%</span>
            <div className="w-8 sm:w-12 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2B5FE0] rounded-full transition-all duration-150"
                style={{ width: `${scrollPercent}%` }}
              />
            </div>
          </div>
        </header>

        {/* ── Zoomed-In Camera-Follow World Container (Height 3200px) ── */}
        <div
          id="camera-world"
          className="absolute top-0 left-0 w-full h-[3200px] pointer-events-auto will-change-transform flex justify-center"
        >
          {/* Centered responsive inner stage */}
          <div className="relative w-full max-w-[600px] h-[3200px] overflow-visible mx-auto">
            {/* ── Vertical S-Curve Road (SVG viewBox="0 0 600 3200") ── */}
            <svg
              viewBox="0 0 600 3200"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-[3200px] pointer-events-none z-10"
            >
              <defs>
                {/* Extrusion shadow filter */}
                <filter id="road-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                </filter>
              </defs>

              {/* 1. Extruded 3D bottom shadow path */}
              <path
                d={ROAD_PATH_D}
                stroke="#1E3A8A"
                strokeWidth="96"
                strokeLinecap="round"
                fill="none"
                transform="translate(0, 14)"
                filter="url(#road-shadow-blur)"
                opacity="0.55"
              />

              {/* 2. Main Blue Road Path */}
              <path
                id="delivery-road"
                d={ROAD_PATH_D}
                stroke="#3B5BDB"
                strokeWidth="88"
                strokeLinecap="round"
                fill="none"
              />

              {/* 3. Center Dashed Line */}
              <path
                d={ROAD_PATH_D}
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="18 18"
                fill="none"
              />

              {/* 4. Checkpoint Rings & Dots */}
              {/* Stop 1: Restaurant (165, 950) */}
              <g transform="translate(165, 950)">
                <circle
                  r="26"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="3.5"
                  opacity={activeStepIndex === 1 ? '0.9' : '0.25'}
                  className={activeStepIndex === 1 ? 'animate-ping' : ''}
                />
                <circle r="10" fill="#FF6B35" stroke="#ffffff" strokeWidth="3" />
              </g>

              {/* Stop 2: Grocery (435, 1700) */}
              <g transform="translate(435, 1700)">
                <circle
                  r="26"
                  fill="none"
                  stroke="#2ECC71"
                  strokeWidth="3.5"
                  opacity={activeStepIndex === 2 ? '0.9' : '0.25'}
                  className={activeStepIndex === 2 ? 'animate-ping' : ''}
                />
                <circle r="10" fill="#2ECC71" stroke="#ffffff" strokeWidth="3" />
              </g>

              {/* Stop 3: Medical (165, 2450) */}
              <g transform="translate(165, 2450)">
                <circle
                  r="26"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="3.5"
                  opacity={activeStepIndex === 3 ? '0.9' : '0.25'}
                  className={activeStepIndex === 3 ? 'animate-ping' : ''}
                />
                <circle r="10" fill="#14B8A6" stroke="#ffffff" strokeWidth="3" />
              </g>

              {/* Stop 4: Customer House (300, 3050) */}
              <g transform="translate(300, 3050)">
                <circle
                  r="26"
                  fill="none"
                  stroke="#2B5FE0"
                  strokeWidth="3.5"
                  opacity={activeStepIndex >= 4 ? '0.9' : '0.25'}
                  className={activeStepIndex >= 4 ? 'animate-ping' : ''}
                />
                <circle r="10" fill="#2B5FE0" stroke="#ffffff" strokeWidth="3" />
              </g>
            </svg>

            {/* ── Strict Zero-Offset Bounding Box Rider Unit (HTML) ──── */}
            <div
              id="rider-unit"
              style={{
                width: '96px',
                height: '96px',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 30,
                pointerEvents: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {/* Dark oval shadow directly underneath scooter */}
              <div
                id="rider-shadow"
                style={{
                  position: 'absolute',
                  inset: '12px',
                  margin: 'auto',
                  zIndex: -1,
                  filter: 'blur(6px)',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  pointerEvents: 'none',
                }}
              />

              {/* Speed lines directly behind rear wheel inside rider-unit */}
              <div
                id="speed-lines"
                style={{
                  position: 'absolute',
                  left: '4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  opacity: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 0,
                }}
              >
                <div style={{ width: '16px', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '9999px' }} />
                <div style={{ width: '24px', height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '9999px' }} />
                <div style={{ width: '14px', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '9999px' }} />
              </div>

              {/* Scooter <img> centered inside #rider-unit */}
              <img
                id="rider-scooter-image"
                src={riderImg}
                alt="Wangoz Delivery Scooter"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  transformOrigin: '50% 50%',
                  filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.20))',
                }}
              />
            </div>

            {/* ── HTML 3D Stores in the Middle of the Road & Parallel Cards ── */}

            {/* ── Parallel HTML 3D Stores in the Middle of Road & Information Cards ── */}

            {/* Stop 1 — Restaurant (Road curve at SVG X=165/600=27.5%, Y=950px) */}
            <div
              id="store-restaurant"
              className="absolute z-20 flex flex-col items-center pointer-events-none opacity-0 select-none w-max"
              style={{ top: '930px', left: 'calc(165 / 600 * 100%)', transform: 'translate(-50%, -50%)' }}
            >
              <div className="mb-0 flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-orange-200">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-[10px] sm:text-xs font-extrabold text-[#FF6B35] tracking-wider uppercase">
                  HOT KITCHENS
                </span>
              </div>
              <img
                src={deliveryStops[0].imageSrc}
                alt="Wangoz Hot Kitchens"
                className="w-56 h-56 sm:w-68 sm:h-68 md:w-80 md:h-80 lg:w-88 lg:h-88 max-w-none object-contain drop-shadow-[0_22px_45px_rgba(0,0,0,0.24)] transition-transform"
              />
            </div>
            <ServiceFeatureCard
              id="card-restaurant"
              stop={deliveryStops[0]}
              className="top-[950px] -translate-y-1/2 right-2 sm:right-4 md:right-5 w-[46%] sm:w-[42%] max-w-[230px] sm:max-w-[280px] md:max-w-[300px]"
            />

            {/* Stop 2 — Grocery (Road curve at SVG X=435/600=72.5%, Y=1700px) */}
            <ServiceFeatureCard
              id="card-grocery"
              stop={deliveryStops[1]}
              className="top-[1700px] -translate-y-1/2 left-2 sm:left-4 md:left-5 w-[46%] sm:w-[42%] max-w-[230px] sm:max-w-[280px] md:max-w-[300px]"
            />
            <div
              id="store-grocery"
              className="absolute z-20 flex flex-col items-center pointer-events-none opacity-0 select-none w-max"
              style={{ top: '1680px', left: 'calc(435 / 600 * 100%)', transform: 'translate(-50%, -50%)' }}
            >
              <div className="mb-0 flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
                <span className="text-[10px] sm:text-xs font-extrabold text-[#2ECC71] tracking-wider uppercase">
                  FARM GROCERY
                </span>
              </div>
              <img
                src={deliveryStops[1].imageSrc}
                alt="Wangoz Farm Grocery"
                className="w-56 h-56 sm:w-68 sm:h-68 md:w-80 md:h-80 lg:w-88 lg:h-88 max-w-none object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.28)] transition-transform"
              />
            </div>

            {/* Stop 3 — Medical (Road curve at SVG X=165/600=27.5%, Y=2450px) */}
            <div
              id="store-medical"
              className="absolute z-20 flex flex-col items-center pointer-events-none opacity-0 select-none w-max"
              style={{ top: '2430px', left: 'calc(165 / 600 * 100%)', transform: 'translate(-50%, -50%)' }}
            >
              <div className="mb-0 flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
                <span className="text-[10px] sm:text-xs font-extrabold text-[#14B8A6] tracking-wider uppercase">
                  24/7 MEDS
                </span>
              </div>
              <img
                src={deliveryStops[2].imageSrc}
                alt="Wangoz 24/7 Meds"
                className="w-56 h-56 sm:w-68 sm:h-68 md:w-80 md:h-80 lg:w-88 lg:h-88 max-w-none object-contain drop-shadow-[0_22px_45px_rgba(0,0,0,0.24)] transition-transform"
              />
            </div>
            <ServiceFeatureCard
              id="card-medical"
              stop={deliveryStops[2]}
              className="top-[2450px] -translate-y-1/2 right-2 sm:right-4 md:right-5 w-[46%] sm:w-[42%] max-w-[230px] sm:max-w-[280px] md:max-w-[300px]"
            />

            {/* Stop 4 — Customer House (Road end at SVG X=300/600=50%, Y=3050px) */}
            <div
              id="store-house"
              className="absolute z-20 flex flex-col items-center pointer-events-none opacity-0 select-none"
              style={{ top: '3050px', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <img
                src={houseImg}
                alt="Customer House - Your Doorstep"
                className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] object-contain drop-shadow-[0_26px_50px_rgba(0,0,0,0.25)] transition-transform"
              />
              <div className="mt-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-[#2B5FE0] animate-pulse" />
                <span className="text-[10px] sm:text-xs font-extrabold text-[#2B5FE0] tracking-wider uppercase">
                  YOUR DOORSTEP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Finale Brand Overlay (Order Arrived & Delivered Celebration) ── */}
        <div
          id="finale-brand-overlay"
          className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-neutral-950/45 backdrop-blur-md opacity-0 pointer-events-none"
        >
          <div className="relative w-[88%] sm:w-full max-w-[350px] sm:max-w-[380px] h-[400px] sm:h-[450px] max-h-[85vh] bg-white/98 backdrop-blur-2xl rounded-[2.75rem] py-4.5 sm:py-5.5 px-5 sm:px-7 text-center flex flex-col items-center justify-between border border-white/80 shadow-[0_28px_70px_-12px_rgba(0,0,0,0.28),0_12px_32px_-6px_rgba(43,95,224,0.22)]">
            {/* 1. 3D Brand Logo (Enlarged) */}
            <div className="pt-1 shrink-0">
              <img
                src={logoImg}
                alt="Wangoz"
                className="w-42 sm:w-48 drop-shadow-[0_12px_24px_rgba(43,95,224,0.24)] hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* 2. Message Cluster: Distinctly wider space between sentences */}
            <div className="flex flex-col items-center w-full px-1 shrink-0 gap-y-5 sm:gap-y-6">
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-xs font-bold tracking-tight shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Order Arrived • Delivered in 14 mins!</span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-[1.85rem] font-black text-neutral-900 leading-snug tracking-tight">
                Ready to <span className="text-[#2B5FE0]">Wangoz?</span>
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-neutral-500 max-w-[270px] sm:max-w-xs leading-relaxed">
                Hot meals, daily groceries &amp; urgent care supplies delivered directly to your doorstep.
              </p>

              {/* 3 Lightweight Value Chips */}
              <div className="flex items-center justify-center gap-2 w-full pt-0.5">
                <span className="px-3.5 py-1.5 rounded-full bg-neutral-100/90 border border-neutral-200/70 text-[11px] sm:text-xs font-bold text-neutral-700 flex items-center gap-1.5 shadow-2xs">
                  <span>⚡</span> 14 Mins
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] sm:text-xs font-bold text-emerald-700 flex items-center gap-1.5 shadow-2xs">
                  <span>✓</span> At Door
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-[11px] sm:text-xs font-bold text-[#2B5FE0] flex items-center gap-1.5 shadow-2xs">
                  ₹0 Delivery
                </span>
              </div>
            </div>

            {/* 3. Actions: Taller Download App Button with side spacing + Dismiss Link */}
            <div className="w-full flex flex-col items-center gap-2.5 pb-0.5 shrink-0">
              <button
                id="finale-download-btn"
                onClick={() => {
                  alert(
                    'Welcome to Wangoz! First delivery promo code WANGOZFREE applied to your app.'
                  );
                }}
                className="w-[84%] sm:w-[82%] py-4.5 sm:py-5 min-h-[54px] sm:min-h-[58px] px-6 rounded-2xl font-black text-white text-base sm:text-lg bg-gradient-to-r from-[#2B5FE0] via-[#3567E8] to-[#2B5FE0] hover:brightness-105 active:scale-[0.98] shadow-[0_12px_26px_-4px_rgba(43,95,224,0.42)] hover:shadow-[0_16px_30px_-4px_rgba(43,95,224,0.52)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Smartphone size={22} className="text-white shrink-0" strokeWidth={2.4} />
                <span className="tracking-tight">Download App</span>
              </button>

              <button
                onClick={() => {
                  const overlay = document.getElementById('finale-brand-overlay');
                  if (overlay) gsap.to(overlay, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
                }}
                className="py-1 px-3 text-xs font-semibold text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Continue scrolling to footer</span>
                <span>↓</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Scroll Hint (0% -> 3% fade out) ──────────────────── */}
        <div
          id="scroll-hint"
          className="absolute bottom-18 sm:bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/60 shadow-md text-xs font-bold text-neutral-700 pointer-events-none whitespace-nowrap"
        >
          <span className="inline-block animate-bounce">↓</span>
          <span>Scroll to start delivery →</span>
        </div>
      </div>
    </div>
  );
}
