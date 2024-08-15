import { useState, createContext, useContext, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser({
        username: decodedToken.username,
        id: decodedToken.id,
      });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    const decodedToken = jwtDecode(token);
    setUser({
      username: decodedToken.username,
      id: decodedToken.id,
    });
  }

  const logout = () => {
    localStorage.removeItem("authToken"); setUser(false);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}