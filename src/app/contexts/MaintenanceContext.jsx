import { createContext, useCallback, useContext, useState } from "react";
import { toast } from "react-toastify";
import { maintenanceService } from "../services/maintenance.service.js";

const MaintenanceContext = createContext(null);

export function MaintenanceProvider({ children }) {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await maintenanceService.listar();
      setMaintenances(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      toast.error("Erro ao carregar manutenções");
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id) => {
    try {
      return await maintenanceService.buscarPorId(id);
    } catch (err) {
      toast.error("Manutenção não encontrada");
      throw err;
    }
  }, []);

  const create = useCallback(
    async (payload) => {
      try {
        await maintenanceService.criar(payload);
        toast.success("Manutenção cadastrada");
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Erro ao cadastrar manutenção");
        return false;
      }
    },
    [fetchAll],
  );

  const update = useCallback(
    async (id, payload) => {
      try {
        await maintenanceService.editar(id, payload);
        toast.success("Manutenção atualizada");
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Erro ao atualizar manutenção");
        return false;
      }
    },
    [fetchAll],
  );

  const remove = useCallback(
    async (id) => {
      try {
        await maintenanceService.remover(id);
        toast.success("Manutenção removida");
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Erro ao remover manutenção");
        return false;
      }
    },
    [fetchAll],
  );

  return (
    <MaintenanceContext.Provider
      value={{ maintenances, loading, error, fetchAll, getById, create, update, remove }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenances() {
  const ctx = useContext(MaintenanceContext);
  if (!ctx) throw new Error("useMaintenances deve ser usado dentro de MaintenanceProvider");
  return ctx;
}
