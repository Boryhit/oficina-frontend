import api from "./api.js";

const RESOURCE = "/workshops";

export const workshopService = {
  async listar() {
    const { data } = await api.get(RESOURCE);
    return data;
  },
  async buscarPorId(id) {
    const { data } = await api.get(`${RESOURCE}/${id}`);
    return data;
  },
  async buscarPorVeiculo(vehicleId) {
    const { data } = await api.get(`${RESOURCE}/vehicle/${vehicleId}`);
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
