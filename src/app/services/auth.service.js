import api from "./api.js";

export const authService = {
  async login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },
  async register({ name, email, password, role }) {
    const { data } = await api.post("/auth/register", { name, email, password, role });
    return data;
  },
  async forgotPassword(email) {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },
  async resetPassword({ token, password }) {
    const { data } = await api.post("/auth/reset-password", { token, password });
    return data;
  },
  async refreshToken(refreshToken) {
    const { data } = await api.post("/auth/refresh", { refreshToken });
    return data;
  },
  async me() {
    const { data } = await api.get("/auth/me");
    return data;
  },
};
