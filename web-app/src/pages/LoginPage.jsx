import { useState, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signIn, signUp, confirmSignUp } from '../auth/CognitoAuth';
import { useAuth } from '../auth/AuthContext';
import HeroCanvas from '../three/HeroCanvas';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedButton from '../components/AnimatedButton';
import { springs, fadeInUp, staggerContainer } from '../lib/motion';
import './LoginPage.css';

const ShieldScene = lazy(() => import('../three/ShieldScene'));

/* ── SVG Icon Components ── */
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

/* ── Password validation (AWS Cognito default policy) ── */
const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower', label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'One number', test: (pw) => /[0-9]/.test(pw) },
  { id: 'special', label: 'One special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function PasswordStrength({ password }) {
  if (!password) return null;
  const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
  const pct = (passed / PASSWORD_RULES.length) * 100;
  const color = pct < 40 ? 'var(--error)' : pct < 80 ? '#f59e0b' : 'var(--success)';

  return (
    <div className="pw-strength">
      <div className="pw-strength-bar">
        <motion.div
          className="pw-strength-fill"
          animate={{ width: pct + '%', background: color }}
          transition={springs.snappy}
        />
      </div>
      <ul className="pw-rules">
        {PASSWORD_RULES.map(r => (
          <motion.li
            key={r.id}
            className={r.test(password) ? 'pass' : ''}
            animate={{ color: r.test(password) ? 'var(--success)' : 'var(--text-muted)' }}
            transition={{ duration: 0.2 }}
          >
            <span className="pw-rule-check">{r.test(password) ? '✓' : '○'}</span>
            {r.label}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // login | signup | confirm
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await signIn(email, password);
      login(session);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    const failed = PASSWORD_RULES.filter(r => !r.test(password));
    if (failed.length > 0) {
      setError('Password does not meet the security requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      setMode('confirm');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmSignUp(email, code);
      const session = await signIn(email, password);
      login(session);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Verification failed. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  return (
    <div className="login-page">
      <HeroCanvas style={{ opacity: 0.25 }} />

      <motion.div
        className="login-card glass"
        initial={{ opacity: 0, y: 30, scale: 0.96, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={springs.smooth}
      >
        {/* Header */}
        <div className="login-header">
          <Suspense fallback={
            <div className="login-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#081018" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
                <path d="M14 2v6h6"/>
                <path d="m9 15 2 2 4-4"/>
              </svg>
            </div>
          }>
            <ShieldScene />
          </Suspense>
          <motion.h2
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.snappy}
          >
            {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Verify Email'}
          </motion.h2>
          <p className="login-subtitle">
            {mode === 'login' && 'Access your secure legal workspace'}
            {mode === 'signup' && 'Set up your professional account'}
            {mode === 'confirm' && 'Complete your registration'}
          </p>
        </div>

        {/* Sign In Form */}
        {mode === 'login' && (
          <motion.form
            onSubmit={handleLogin}
            className="login-form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springs.gentle}
          >
            <AnimatedInput
              id="login-email"
              type="email"
              label="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@organization.com"
              required
              autoComplete="email"
            />
            <AnimatedInput
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            >
              <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)} title={showPassword ? 'Hide password' : 'Show password'} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </AnimatedInput>

            {error && (
              <motion.div
                className="login-error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springs.snappy}
              >
                <ShieldIcon />{error}
              </motion.div>
            )}

            <AnimatedButton type="submit" variant="primary" loading={loading} className="login-btn">
              {loading ? 'Authenticating...' : 'Sign In'}
            </AnimatedButton>

            <div className="login-divider"><span>or</span></div>

            <p className="login-switch">
              New to Legal Doc Drafter? <button type="button" onClick={() => switchMode('signup')}>Create an account</button>
            </p>
          </motion.form>
        )}

        {/* Sign Up Form */}
        {mode === 'signup' && (
          <motion.form
            onSubmit={handleSignUp}
            className="login-form"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springs.gentle}
          >
            <AnimatedInput
              id="signup-email"
              type="email"
              label="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@organization.com"
              required
              autoComplete="email"
            />
            <AnimatedInput
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a secure password"
              required
              autoComplete="new-password"
            >
              <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)} title={showPassword ? 'Hide password' : 'Show password'} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </AnimatedInput>
            <PasswordStrength password={password} />

            <AnimatedInput
              id="signup-confirm"
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
            >
              {confirmPassword && (
                <span className={`confirm-indicator ${password === confirmPassword ? 'match' : 'mismatch'}`}>
                  {password === confirmPassword ? '✓' : '✗'}
                </span>
              )}
            </AnimatedInput>

            {error && (
              <motion.div className="login-error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={springs.snappy}>
                <ShieldIcon />{error}
              </motion.div>
            )}

            <AnimatedButton type="submit" variant="primary" loading={loading} className="login-btn">
              {loading ? 'Creating account...' : 'Create Account'}
            </AnimatedButton>

            <div className="login-divider"><span>or</span></div>

            <p className="login-switch">
              Already have an account? <button type="button" onClick={() => switchMode('login')}>Sign in</button>
            </p>
          </motion.form>
        )}

        {/* Email Verification */}
        {mode === 'confirm' && (
          <motion.form
            onSubmit={handleConfirm}
            className="login-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
          >
            <div className="verify-notice">
              <LockIcon />
              <span>A 6-digit verification code has been sent to <strong>{email}</strong></span>
            </div>
            <AnimatedInput
              id="verify-code"
              type="text"
              label="Verification Code"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
              autoComplete="one-time-code"
              style={{ letterSpacing: '4px', textAlign: 'center', fontSize: 18, fontWeight: 600 }}
            />

            {error && (
              <motion.div className="login-error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={springs.snappy}>
                <ShieldIcon />{error}
              </motion.div>
            )}

            <AnimatedButton type="submit" variant="primary" loading={loading} className="login-btn">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </AnimatedButton>
          </motion.form>
        )}

        {/* Security Footer */}
        <div className="security-footer">
          <div className="security-footer-item">
            <LockIcon />
            <span>Encrypted session</span>
          </div>
          <div className="security-footer-divider" />
          <div className="security-footer-item">
            <ShieldIcon />
            <span>AWS Cognito</span>
          </div>
        </div>
      </motion.div>

      <Link to="/" className="login-back-link">← Back to home</Link>
    </div>
  );
}
