import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Table from "../../components/Table/Table.jsx";
import Button from "../../components/Button/Button.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import { useMaintenances } from "../../contexts/MaintenanceContext.jsx";
import { useVehicles } from "../../contexts/VehicleContext.jsx";
import { useWorkshops } from "../../contexts/WorkshopContext.jsx";
import { formatCurrency, formatDate } from "../../utils/format.js";

export default function MaintenanceList() {
  const { maintenances, loading, fetchAll, remove } = useMaintenances();
  const { vehicles, fetchAll: fetchVehicles } = useVehicles();
  const { workshops, fetchAll: fetchWorkshops } = useWorkshops();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
    fetchVehicles();
    fetchWorkshops();
  }, [fetchAll, fetchVehicles, fetchWorkshops]);

  const vehicleLabel = (row) => {
    if (row.vehicle) return row.vehicle.placa || row.vehicle.plate || row.vehicle.id;
    const vid = row.vehicleId || row.vehicle_id;
    const v = vehicles.find((x) => (x.id || x._id) === vid);
    return v ? v.placa || v.plate : vid || "—";
  };
  const workshopLabel = (row) => {
    if (row.workshop) return row.workshop.nome || row.workshop.name || row.workshop.id;
    const wid = row.workshopId || row.workshop_id;
    const w = workshops.find((x) => (x.id || x._id) === wid);
    return w ? w.nome || w.name : wid || "—";
  };

  const askRemove = async (row) => {
    const res = await Swal.fire({
      title: "Excluir manutenção?",
      text: `"${row.descricao || row.description || "Registro"}" será removida.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (res.isConfirmed) await remove(row.id || row._id);
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Início", to: "/dashboard" }, { label: "Manutenções" }]} />
      <div className="op-page-header">
        <div>
          <h1 className="op-page-title">Manutenções</h1>
          <div className="op-page-subtitle">Histórico de serviços realizados</div>
        </div>
        <Link to="/maintenances/new">
          <Button variant="accent" icon={<FiPlus />}>
            Nova manutenção
          </Button>
        </Link>
      </div>

      <Table
        loading={loading}
        rows={maintenances}
        searchPlaceholder="Buscar por descrição, veículo, oficina…"
        columns={[
          { key: "descricao", label: "Descrição", render: (r) => r.descricao || r.description || "—" },
          {
            key: "data",
            label: "Data",
            render: (r) => formatDate(r.data || r.date),
            sortAccessor: (r) => new Date(r.data || r.date || 0).getTime(),
          },
          {
            key: "valor",
            label: "Valor",
            render: (r) => formatCurrency(r.valor || r.value),
            sortAccessor: (r) => Number(r.valor || r.value || 0),
          },
          { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
          { key: "vehicle", label: "Veículo", render: (r) => vehicleLabel(r) },
          { key: "workshop", label: "Oficina", render: (r) => workshopLabel(r) },
          {
            key: "actions",
            label: "Ações",
            align: "right",
            sortable: false,
            render: (r) => {
              const id = r.id || r._id;
              return (
                <div className="actions">
                  <button className="op-btn-icon" title="Visualizar" onClick={() => navigate(`/maintenances/${id}`)}>
                    <FiEye />
                  </button>
                  <button className="op-btn-icon" title="Editar" onClick={() => navigate(`/maintenances/${id}/edit`)}>
                    <FiEdit2 />
                  </button>
                  <button className="op-btn-icon danger" title="Excluir" onClick={() => askRemove(r)}>
                    <FiTrash2 />
                  </button>
                </div>
              );
            },
          },
        ]}
      />
    </>
  );
}
