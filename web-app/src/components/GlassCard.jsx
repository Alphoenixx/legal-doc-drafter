import { motion } from 'framer-motion';
import { springs, hoverLift } from '../lib/motion';

/**
 * Glass card with hover lift + shadow diffusion.
 * Supports depth variants: 'light' | 'default' | 'heavy'
 */
export default function GlassCard({
  children,
  className = '',
  depth = 'default',
  hover = true,
  padding = true,
  style,
  onClick,
  ...props
}) {
  const depthStyles = {
    light: {
      background: 'var(--glass-bg-light)',
      backdropFilter: 'blur(var(--glass-blur))',
      WebkitBackdropFilter: 'blur(var(--glass-blur))',
    },
    default: {
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(var(--glass-blur))',
      WebkitBackdropFilter: 'blur(var(--glass-blur))',
    },
    heavy: {
      background: 'var(--glass-bg-heavy)',
      backdropFilter: 'blur(var(--glass-blur-heavy))',
      WebkitBackdropFilter: 'blur(var(--glass-blur-heavy))',
    },
  };

  const baseStyle = {
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-lg)',
    padding: padding ? '24px' : undefined,
    position: 'relative',
    overflow: 'hidden',
    ...depthStyles[depth],
    ...style,
  };

  const hoverProps = hover
    ? {
        whileHover: {
          y: -4,
          boxShadow: 'var(--shadow-float)',
          borderColor: 'var(--glass-border-hover)',
          transition: springs.snappy,
        },
        whileTap: { scale: 0.99, transition: springs.snappy },
      }
    : {};

  return (
    <motion.div
      className={`glass-card ${className}`}
      style={baseStyle}
      onClick={onClick}
      {...hoverProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}
