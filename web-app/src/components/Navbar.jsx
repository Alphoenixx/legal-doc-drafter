import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar glass">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#081018" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
            <path d="M14 2v6h6"/>
            <path d="m9 15 2 2 4-4"/>
          </svg>
        </div>
        <span>Legal Doc Drafter</span>
      </Link>

      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-email">{user.email}</span>
            <button className="btn-ghost" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Sign In</Link>
        )}
      </div>
    </nav>
  );
}
