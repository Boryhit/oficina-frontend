import { createContext, useCallback, useContext, useState } from "react";
import { toast } from "react-toastify";
import { workshopService } from "../services/workshop.service.js";

const WorkshopContext = createContext(null);

export function WorkshopProvider({ children }) {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workshopService.listar();
      setWorkshops(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      toast.error("Erro ao carregar oficinas");
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id) => {
    try {
      return await workshopService.buscarPorId(id);
    } catch (err) {
      toast.error("Oficina não encontrada");
      throw err;
    }
  }, []);

  const create = useCallback(
    async (payload) => {
      try {
        await workshopService.criar(payload);
        toast.success("Oficina cadastrada");
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Erro ao cadastrar oficina");
        return false;
      }
    },
    [fetchAll],
  );

  const update = useCallback(
    async (id, payload) => {
      try {
        await workshopService.editar(id, payload);
        toast.success("Oficina atualizada");
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Erro ao atualizar oficina");
        return false;
      }
    },
    [fetchAll],
  );

  const remove = useCallback(
    async (id) => {
      try {
        await workshopService.remover(id);
        toast.success("Oficina removida");
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Erro ao remover oficina");
        return false;
      }
    },
    [fetchAll],
  );

  return (
    <WorkshopContext.Provider
      value={{ workshops, loading, error, fetchAll, getById, create, update, remove }}
    >
      {children}
    </WorkshopContext.Provider>
  );
}

export function useWorkshops() {
  const ctx = useContext(WorkshopContext);
  if (!ctx) throw new Error("useWorkshops deve ser usado dentro de WorkshopProvider");
  return ctx;
}
