import { motion } from 'framer-motion';
import { springs } from '../lib/motion';
import './AnimatedButton.css';

/**
 * Button with spring press + glow feedback.
 * Variants: 'primary' | 'ghost' | 'outline'
 */
export default function AnimatedButton({
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  style,
  ...props
}) {
  return (
    <motion.button
      type={type}
      className={`anim-btn anim-btn-${variant} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.025,
              boxShadow:
                variant === 'primary'
                  ? '0 0 30px rgba(18, 214, 197, 0.25), 0 4px 20px rgba(0,0,0,0.3)'
                  : '0 0 20px rgba(18, 214, 197, 0.1)',
              transition: springs.snappy,
            }
      }
      whileTap={disabled ? {} : { scale: 0.96, transition: springs.snappy }}
      {...props}
    >
      {loading && <span className="anim-btn-spinner" />}
      {children}
    </motion.button>
  );
}
