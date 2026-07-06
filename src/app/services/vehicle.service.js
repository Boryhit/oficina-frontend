import api from "./api.js";

const RESOURCE = "/vehicles";

export const vehicleService = {
  async listar() {
    const { data } = await api.get(RESOURCE);
    return data;
  },
  async buscarPorId(id) {
    const { data } = await api.get(`${RESOURCE}/${id}`);
    return data;
  },
  async buscarManutencoes(maintenanceId) {
    const { data } = await api.get(`${RESOURCE}/maintenance/${maintenanceId}`);
    return data;
  },
  async criar(payload) {
    const { data } = await api.post(RESOURCE, payload);
    return data;
  },
  async editar(id, payload) {
    const { data } = await api.put(`${RESOURCE}/${id}`, payload);
    return data;
  },
  async remover(id) {
    const { data } = await api.delete(`${RESOURCE}/${id}`);
    return data;
  },
};
