import { motion } from 'framer-motion';
import './ProcessingPipeline.css';

const STEPS = [
  { label: 'Upload', icon: 'U' },
  { label: 'Extract', icon: 'E' },
  { label: 'Structure', icon: 'S' },
  { label: 'Draft', icon: 'D' },
  { label: 'PDF', icon: 'P' },
];

export default function ProcessingPipeline({ step = 0 }) {
  return (
    <div className="pipeline">
      <div className="pipeline-track">
        {STEPS.map((s, i) => {
          const isActive = i <= step;
          const isCurrent = i === step;
          return (
            <div key={i} className="pipeline-step-wrap">
              {/* Connector line (before each node except the first) */}
              {i > 0 && (
                <div className="pipeline-connector">
                  <motion.div
                    className="pipeline-connector-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: isActive ? 0.1 : 0 }}
                  />
                  {isCurrent && (
                    <motion.div
                      className="pipeline-beam"
                      initial={{ left: '0%' }}
                      animate={{ left: '100%' }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </div>
              )}
              {/* Node */}
              <motion.div
                className={`pipeline-node ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                initial={{ scale: 0.8, opacity: 0.4 }}
                animate={{
                  scale: isCurrent ? 1.15 : isActive ? 1 : 0.85,
                  opacity: isActive ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="pipeline-node-icon">{s.icon}</span>
                {isCurrent && <div className="pipeline-node-ring" />}
              </motion.div>
              <span className={`pipeline-label ${isActive ? 'active' : ''}`}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
