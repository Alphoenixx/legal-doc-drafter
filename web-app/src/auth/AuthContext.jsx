import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentSession, signOut as cognitoSignOut } from './CognitoAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentSession()
      .then((session) => {
        setUser({
          idToken: session.getIdToken().getJwtToken(),
          email: session.getIdToken().payload.email,
        });
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    cognitoSignOut();
    setUser(null);
  };

  const login = (session) => {
    setUser({
      idToken: session.getIdToken().getJwtToken(),
      email: session.getIdToken().payload.email,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
