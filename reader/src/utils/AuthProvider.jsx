import { useState, createContext, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setUser(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setUser(true);
  }

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =  useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}