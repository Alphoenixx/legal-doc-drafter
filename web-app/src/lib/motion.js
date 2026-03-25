/**
 * Central motion configuration — spring presets, animation helpers, and reduced-motion detection.
 */

/* ─── Spring Presets (Framer Motion) ─── */
export const springs = {
  gentle: { type: 'spring', stiffness: 120, damping: 20, mass: 1 },
  snappy: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 },
  bouncy: { type: 'spring', stiffness: 400, damping: 15, mass: 0.5 },
  smooth: { type: 'spring', stiffness: 180, damping: 25, mass: 1 },
  slow:   { type: 'spring', stiffness: 80,  damping: 20, mass: 1.2 },
};

/* ─── Common Framer Motion Variants ─── */
export const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { ...springs.gentle, delay: i * 0.08 },
  }),
};

export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: springs.smooth,
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: springs.gentle },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: springs.gentle },
};

/* ─── Hover Presets ─── */
export const hoverLift = {
  whileHover: {
    y: -6,
    scale: 1.02,
    boxShadow: '0 12px 40px rgba(0,0,0,0.3), 0 0 30px rgba(18,214,197,0.08)',
    transition: springs.snappy,
  },
  whileTap: { scale: 0.98, transition: springs.snappy },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 40px rgba(18,214,197,0.15), 0 8px 30px rgba(0,0,0,0.3)',
    borderColor: 'rgba(18, 214, 197, 0.25)',
    transition: springs.snappy,
  },
};

export const buttonPress = {
  whileHover: { scale: 1.02, transition: springs.snappy },
  whileTap: { scale: 0.96, transition: springs.snappy },
};

/* ─── Reduced Motion Detection ─── */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ─── GSAP ScrollTrigger Defaults ─── */
export const scrollTriggerDefaults = {
  start: 'top 85%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
};

/* ─── Page Transition Variants ─── */
export const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { ...springs.smooth, duration: 0.5 },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};
