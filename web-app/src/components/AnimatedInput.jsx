import { useState } from 'react';
import { motion } from 'framer-motion';
import { springs } from '../lib/motion';
import './AnimatedInput.css';

/**
 * Input with animated border glow on focus and floating label.
 */
export default function AnimatedInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  maxLength,
  style,
  className = '',
  children,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`anim-input-group ${className}`}>
      {label && (
        <motion.label
          htmlFor={id}
          className="anim-input-label"
          animate={{
            color: focused ? 'var(--accent)' : 'var(--text-muted)',
          }}
          transition={springs.snappy}
        >
          {label}
        </motion.label>
      )}
      <div className="anim-input-wrapper">
        <motion.div
          className="anim-input-glow"
          animate={{
            opacity: focused ? 1 : 0,
            scale: focused ? 1 : 0.98,
          }}
          transition={springs.snappy}
        />
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          style={style}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`anim-input ${focused ? 'focused' : ''}`}
          {...props}
        />
        {children}
      </div>
    </div>
  );
}
