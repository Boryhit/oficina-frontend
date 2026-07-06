import { createContext, useCallback, useContext, useState } from "react";
import { toast } from "react-toastify";
import { vehicleService } from "../services/vehicle.service.js";

const VehicleContext = createContext(null);

export function VehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.listar();
      setVehicles(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      toast.error("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id) => {
    try {
      return await vehicleService.buscarPorId(id);
    } catch (err) {
      toast.error("Veículo não encontrado");
      throw err;
    }
  }, []);

  const create = useCallback(
    async (payload) => {
      try {
        await vehicleService.criar(payload);
        toast.success("Veículo cadastrado com sucesso");
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Erro ao cadastrar veículo");
        return false;
      }
    },
    [fetchAll],
  );

  const update = useCallback(
    async (id, payload) => {
      try {
        await vehicleService.editar(id, payload);
        toast.success("Veículo atualizado");
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Erro ao atualizar veículo");
        return false;
      }
    },
    [fetchAll],
  );

  const remove = useCallback(
    async (id) => {
      try {
        await vehicleService.remover(id);
        toast.success("Veículo removido");
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Erro ao remover veículo");
        return false;
      }
    },
    [fetchAll],
  );

  return (
    <VehicleContext.Provider
      value={{ vehicles, loading, error, fetchAll, getById, create, update, remove }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error("useVehicles deve ser usado dentro de VehicleProvider");
  return ctx;
}
