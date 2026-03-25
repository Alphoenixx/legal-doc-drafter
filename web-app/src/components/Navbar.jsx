import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { springs } from '../lib/motion';
import AnimatedButton from './AnimatedButton';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar glass ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
    >
      <Link to="/" className="navbar-brand">
        <motion.div
          className="navbar-logo"
          whileHover={{ scale: 1.08, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          transition={springs.snappy}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#081018" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
            <path d="M14 2v6h6"/>
            <path d="m9 15 2 2 4-4"/>
          </svg>
        </motion.div>
        <span>Legal Doc Drafter</span>
      </Link>

      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-email">{user.email}</span>
            <AnimatedButton variant="ghost" onClick={logout} style={{ padding: '8px 16px', fontSize: 13 }}>
              Logout
            </AnimatedButton>
          </>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <AnimatedButton variant="primary" style={{ padding: '8px 20px', fontSize: 13 }}>
              Sign In
            </AnimatedButton>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
