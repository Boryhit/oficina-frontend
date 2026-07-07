import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

const TOKEN_KEY = "@oficinapro:token";
const REFRESH_KEY = "@oficinapro:refresh";
const USER_KEY = "@oficinapro:user";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  pendingQueue = [];
};

const clearSessionAndRedirect = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    // não tenta refresh em rotas de auth
    const isAuthRoute = original?.url?.includes("/auth/");

    if (status === 401 && !original._retry && !isAuthRoute) {
      const refreshToken = localStorage.getItem(REFRESH_KEY);
      if (!refreshToken) {
        clearSessionAndRedirect();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken },
        );
        const newToken = data.token || data.accessToken || data.access_token;
        if (!newToken) throw new Error("Refresh sem token");
        localStorage.setItem(TOKEN_KEY, newToken);
        if (data.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);
        clearSessionAndRedirect();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 401) {
      clearSessionAndRedirect();
    }

    return Promise.reject(error);
  },
);

export default api;
