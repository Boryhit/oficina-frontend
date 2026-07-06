import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("@oficinapro:user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      const token = data.token || data.accessToken || data.access_token;
      const userData = data.user || { email: credentials.email };
      if (!token) throw new Error("Token não recebido da API");
      localStorage.setItem("@oficinapro:token", token);
      localStorage.setItem("@oficinapro:user", JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Falha no login");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("@oficinapro:token");
    localStorage.removeItem("@oficinapro:user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
