import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app in a Lenis smooth-scroll context that is synchronised
 * with GSAP's ticker and ScrollTrigger so scroll-scrubbed animations
 * are buttery-smooth at 60 fps.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
    });

    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    // Sync Lenis scroll position into ScrollTrigger on every scroll event
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's high-perf rAF ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP provides time in seconds
    };
    gsap.ticker.add(tickerCallback);

    // Prevent Lenis from running its own rAF loop
    gsap.ticker.lagSmoothing(0);

    return () => {
      delete (window as any).__lenis;
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
