import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    // TODO: Check if the token is expired
    // const currentTime = Date.now() / 1000;
    // if (decodedToken.exp && decodedToken.exp < currentTime) {
    //   // Token has expired, clear it
    //   logout();
    if (token) {
      setIsAuthenticated(true);
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          username: decodedToken.username,
          id: decodedToken.id,
        });
      } catch (err) {
        console.log('jwtToken decode error', err);
      }
    }

    setLoading(false);
  }, [])

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  }

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}