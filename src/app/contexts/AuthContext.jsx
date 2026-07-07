import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "@oficinapro:token";
const REFRESH_KEY = "@oficinapro:refresh";
const USER_KEY = "@oficinapro:user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const persistSession = useCallback((data, fallbackEmail) => {
    const token = data.token || data.accessToken || data.access_token;
    const refresh = data.refreshToken || data.refresh_token;
    const userData = data.user || { email: fallbackEmail };
    if (!token) throw new Error("Token não recebido da API");
    localStorage.setItem(TOKEN_KEY, token);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.login(credentials);
        persistSession(data, credentials.email);
        return true;
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Falha no login");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [persistSession],
  );

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.register(payload);
        // se a API já retornar token, faz auto-login; senão pede login manual
        if (data.token || data.accessToken || data.access_token) {
          persistSession(data, payload.email);
        }
        return { success: true, autoLogin: !!(data.token || data.accessToken) };
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Falha no cadastro";
        setError(msg);
        return { success: false, message: msg };
      } finally {
        setLoading(false);
      }
    },
    [persistSession],
  );

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Erro ao solicitar recuperação",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async ({ token, password }) => {
    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Erro ao redefinir senha",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      if (Array.isArray(user.roles)) return user.roles.includes(role);
      return user.role === role;
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        hasRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
