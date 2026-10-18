import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SmoothScrollProvider } from './providers/SmoothScrollProvider';
import { logoImg, houseImg } from './data/deliveryStops';
import { ScrollyDeliveryStage } from './components/ScrollyDeliveryStage';
import {
  ArrowDown,
  ArrowRight,
  Zap,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ── Floating decorative particles ─────────────────────────── */
function FloatingParticles() {
  const particles = [
    { size: 200, color: '#2B5FE0', top: '10%', left: '-5%', delay: '0s' },
    { size: 140, color: '#6366F1', top: '30%', right: '-3%', delay: '5s' },
    { size: 100, color: '#2B5FE0', bottom: '15%', left: '10%', delay: '10s' },
    { size: 160, color: '#14B8A6', top: '60%', right: '5%', delay: '7s' },
    { size: 80, color: '#FF6B35', bottom: '30%', right: '15%', delay: '3s' },
  ];

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className="float-particle"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            animationDelay: p.delay,
          }}
        />
      ))}
    </>
  );
}

/* ── Stats bar below hero ──────────────────────────────────── */
function StatsBar() {
  const stats = [
    { icon: Zap, value: '15 min', label: 'Avg delivery' },
    { icon: MapPin, value: '500+', label: 'Cities covered' },
    { icon: Clock, value: '24/7', label: 'Always open' },
  ];

  return (
    <div className="flex flex-row items-center justify-between sm:justify-center gap-2 sm:gap-8 md:gap-10 py-3 sm:py-3.5 px-4 sm:px-8 rounded-2xl bg-white/80 backdrop-blur-md border border-neutral-900/10 shadow-sm w-full max-w-md mx-auto">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-2 sm:gap-2.5">
          <div
            className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-xl shrink-0"
            style={{ backgroundColor: 'rgba(43, 95, 224, 0.12)' }}
          >
            <s.icon size={15} color="#2B5FE0" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <div className="text-xs sm:text-base font-black text-neutral-900 leading-tight">
              {s.value}
            </div>
            <div className="text-[9px] sm:text-[11px] font-bold text-neutral-600 leading-tight whitespace-nowrap">
              {s.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main App ──────────────────────────────────────────────── */
function App() {
  const heroRef = useRef<HTMLElement>(null);
  const heroLogoRef = useRef<HTMLImageElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroBtnsRef = useRef<HTMLDivElement>(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance timeline
      const heroTl = gsap.timeline({ delay: 0.15 });

      heroTl
        .fromTo(
          heroLogoRef.current,
          { opacity: 0, scale: 0.85, y: -25 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)' }
        )
        .fromTo(
          heroTitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          heroSubRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          heroBtnsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        )
        .fromTo(
          heroStatsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        );

      // CTA section entrance
      if (ctaSectionRef.current) {
        const ctaChildren = ctaSectionRef.current.querySelectorAll('.cta-animate');
        gsap.fromTo(
          ctaChildren,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaSectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleScrollToJourney = () => {
    const stage = document.getElementById('delivery-experience');
    if (stage) {
      stage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToOrder = () => {
    const finale = document.getElementById('finale');
    if (finale) {
      finale.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SmoothScrollProvider>
      <main className="relative">
        <FloatingParticles />

        {/* ═══════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="hero-section flex flex-col items-center justify-between min-h-[100dvh] pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 relative overflow-hidden"
        >
          {/* Top Center: Wangoz Very Big Brand Logo */}
          <div className="w-full flex justify-center items-center pt-2 sm:pt-4 shrink-0">
            <img
              ref={heroLogoRef}
              src={logoImg}
              alt="Wangoz"
              className="hero-logo w-[76vw] sm:w-[50vw] md:w-[38vw] max-w-[420px] min-w-[260px]"
              style={{
                filter: 'drop-shadow(0 14px 36px rgba(43,95,224,0.28))',
              }}
            />
          </div>

          {/* Middle Flow: Headline, Subtitle, and CTA Buttons spread equally down to the bottom on mobile */}
          <div className="flex-1 w-full max-w-2xl flex flex-col justify-evenly sm:justify-start items-center text-center py-2 sm:py-0 sm:mt-6">
            {/* Headline */}
            <h1 ref={heroTitleRef} className="hero-tagline px-2 sm:mb-3">
              Anything. Delivered.
              <br />
              <span className="hero-tagline-accent">In Minutes.</span>
            </h1>

            {/* Subtitle */}
            <p ref={heroSubRef} className="hero-subtitle px-4 max-w-lg leading-relaxed text-neutral-700 text-sm sm:text-base md:text-lg sm:mb-6">
              Food, groceries, and medicines — delivered to your door faster than
              you can say <strong>"Wangoz"</strong>.
            </p>

            {/* CTA Buttons */}
            <div
              ref={heroBtnsRef}
              className="flex flex-row gap-3 sm:gap-4 justify-center items-center flex-wrap px-2"
            >
              <button
                className="btn-primary py-3.5 px-7 sm:px-8 text-sm sm:text-base font-black shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
                id="hero-order-btn"
                onClick={handleScrollToOrder}
              >
                Order Now <ArrowRight size={15} strokeWidth={2.5} />
              </button>
              <button
                className="btn-secondary py-3.5 px-7 sm:px-8 text-sm sm:text-base font-bold hover:scale-105 active:scale-95 transition-all"
                id="hero-explore-btn"
                onClick={handleScrollToJourney}
              >
                Explore Services <ArrowDown size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Bottom Center: Trust Stats Bar pinned cleanly at the bottom */}
          <div ref={heroStatsRef} className="w-full flex justify-center pb-2 sm:pb-4 sm:mt-auto pt-2 sm:pt-8 shrink-0">
            <StatsBar />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CORE SCROLLYTELLING DELIVERY STAGE (700vh)
        ═══════════════════════════════════════════════════════ */}
        <ScrollyDeliveryStage />

        {/* ═══════════════════════════════════════════════════════
            FINALE / CTA
        ═══════════════════════════════════════════════════════ */}
        <section
          ref={ctaSectionRef}
          className="cta-section min-h-[75vh] flex flex-col items-center justify-center"
          id="finale"
        >
          {/* House illustration */}
          <img
            src={houseImg}
            alt="Delivery to your door"
            className="cta-animate mb-8 hover:scale-105 transition-transform duration-500"
            style={{
              width: 'clamp(220px, 32vw, 360px)',
              filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.14))',
            }}
          />

          <h2
            className="cta-animate text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
            style={{ color: 'var(--color-brand-black)', letterSpacing: '-0.03em' }}
          >
            Ready to{' '}
            <span className="hero-tagline-accent">Wangoz</span>?
          </h2>

          <p
            className="cta-animate text-lg md:text-xl max-w-xl mb-10"
            style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
          >
            Download the app and get your first delivery free.
            <br />
            Because great things shouldn't keep you waiting.
          </p>

          <div className="cta-animate flex items-center gap-4 flex-wrap justify-center">
            <button
              className="btn-primary text-lg"
              id="cta-start-btn"
              onClick={() => alert('Welcome to Wangoz! First delivery promo code WANGOZFREE applied.')}
            >
              Get Started <Sparkles size={20} strokeWidth={2.5} />
            </button>
            <button
              className="btn-secondary text-lg"
              id="cta-replay-btn"
              onClick={handleScrollToJourney}
            >
              Replay Journey <ArrowDown size={18} strokeWidth={2.5} />
            </button>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════ */}
        <footer
          className="text-center py-8 px-6"
          style={{
            borderTop: '1px solid rgba(26, 26, 26, 0.08)',
            color: 'var(--color-text-muted)',
            fontSize: '0.85rem',
          }}
        >
          <img
            src={logoImg}
            alt="Wangoz"
            style={{ width: 110, margin: '0 auto 0.75rem', opacity: 0.7 }}
          />
          © {new Date().getFullYear()} Wangoz. All rights reserved. Fast. Fresh. Reliable.
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}

export default App;
