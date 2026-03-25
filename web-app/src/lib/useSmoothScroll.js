import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { prefersReducedMotion } from './motion';

/**
 * Initializes Lenis smooth scrolling. Call once at the App level.
 * Uses native scroll wrapper (html element) so IntersectionObserver
 * (used by Framer Motion whileInView) still works correctly.
 */
export default function useSmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      // Use the native html/body scroll — ensures IntersectionObserver
      // (used by Framer Motion whileInView) detects visibility correctly.
      wrapper: window,
      content: document.documentElement,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
