import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiFilter, FiX } from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Table from "../../components/Table/Table.jsx";
import Button from "../../components/Button/Button.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import Card from "../../components/Card/Card.jsx";
import { useMaintenances } from "../../contexts/MaintenanceContext.jsx";
import { useVehicles } from "../../contexts/VehicleContext.jsx";
import { useWorkshops } from "../../contexts/WorkshopContext.jsx";
import { formatCurrency, formatDate } from "../../utils/format.js";
import { exportToCsv } from "../../utils/csv.js";

const STATUS_OPTIONS = ["pendente", "em_andamento", "concluida", "cancelada"];

const maintenanceDescription = (row) =>
  row.descricao || row.description || row.services?.join?.(", ") || "—";

const maintenanceValue = (row) => row.valor ?? row.value ?? row.totalCost ?? 0;

export default function MaintenanceList() {
  const { maintenances, loading, fetchAll, remove } = useMaintenances();
  const { vehicles, fetchAll: fetchVehicles } = useVehicles();
  const { workshops, fetchAll: fetchWorkshops } = useWorkshops();
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [fStatus, setFStatus] = useState("");
  const [fVehicle, setFVehicle] = useState("");
  const [fWorkshop, setFWorkshop] = useState("");
  const [fFrom, setFFrom] = useState("");
  const [fTo, setFTo] = useState("");
  const [fMin, setFMin] = useState("");
  const [fMax, setFMax] = useState("");

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

  const filtered = useMemo(() => {
    return maintenances.filter((r) => {
      if (fStatus && r.status !== fStatus) return false;
      const vid = r.vehicleId || r.vehicle_id || r.vehicle?.id;
      if (fVehicle && String(vid) !== String(fVehicle)) return false;
      const wid = r.workshopId || r.workshop_id || r.workshop?.id;
      if (fWorkshop && String(wid) !== String(fWorkshop)) return false;
      const raw = r.data || r.date;
      const d = raw ? new Date(raw) : null;
      if (fFrom && (!d || d < new Date(fFrom))) return false;
      if (fTo) {
        const to = new Date(fTo);
        to.setHours(23, 59, 59, 999);
        if (!d || d > to) return false;
      }
      const val = Number(maintenanceValue(r));
      if (fMin !== "" && val < Number(fMin)) return false;
      if (fMax !== "" && val > Number(fMax)) return false;
      return true;
    });
  }, [maintenances, fStatus, fVehicle, fWorkshop, fFrom, fTo, fMin, fMax]);

  const clearFilters = () => {
    setFStatus(""); setFVehicle(""); setFWorkshop("");
    setFFrom(""); setFTo(""); setFMin(""); setFMax("");
  };
  const activeCount =
    [fStatus, fVehicle, fWorkshop, fFrom, fTo, fMin, fMax].filter((x) => x !== "").length;

  const handleExport = () => {
    exportToCsv("manutencoes", filtered, [
      { key: "descricao", label: "Descrição", render: (r) => maintenanceDescription(r) },
      { key: "data", label: "Data", render: (r) => formatDate(r.data || r.date) },
      { key: "valor", label: "Valor", render: (r) => maintenanceValue(r) },
      { key: "status", label: "Status", render: (r) => r.status || "" },
      { key: "veiculo", label: "Veículo", render: (r) => vehicleLabel(r) },
      { key: "oficina", label: "Oficina", render: (r) => workshopLabel(r) },
    ]);
  };

  const askRemove = async (row) => {
    const res = await Swal.fire({
      title: "Excluir manutenção?",
      text: `"${maintenanceDescription(row)}" será removida.`,
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
        <div className="op-row">
          <Button
            variant="ghost"
            icon={<FiFilter />}
            onClick={() => setShowFilters((s) => !s)}
          >
            Filtros{activeCount ? ` (${activeCount})` : ""}
          </Button>
          <Button variant="ghost" icon={<FiDownload />} onClick={handleExport}>
            Exportar CSV
          </Button>
          <Link to="/maintenances/new">
            <Button variant="accent" icon={<FiPlus />}>
              Nova manutenção
            </Button>
          </Link>
        </div>
      </div>

      {showFilters && (
        <div style={{ marginBottom: 16 }}>
        <Card title="Filtros">

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            <label className="op-field">
              <span>Status</span>
              <select value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
                <option value="">Todos</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="op-field">
              <span>Veículo</span>
              <select value={fVehicle} onChange={(e) => setFVehicle(e.target.value)}>
                <option value="">Todos</option>
                {vehicles.map((v) => {
                  const id = v.id || v._id;
                  return (
                    <option key={id} value={id}>
                      {v.placa || v.plate || id}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="op-field">
              <span>Oficina</span>
              <select value={fWorkshop} onChange={(e) => setFWorkshop(e.target.value)}>
                <option value="">Todas</option>
                {workshops.map((w) => {
                  const id = w.id || w._id;
                  return (
                    <option key={id} value={id}>
                      {w.nome || w.name || id}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="op-field">
              <span>De</span>
              <input type="date" value={fFrom} onChange={(e) => setFFrom(e.target.value)} />
            </label>
            <label className="op-field">
              <span>Até</span>
              <input type="date" value={fTo} onChange={(e) => setFTo(e.target.value)} />
            </label>
            <label className="op-field">
              <span>Valor mín.</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fMin}
                onChange={(e) => setFMin(e.target.value)}
              />
            </label>
            <label className="op-field">
              <span>Valor máx.</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fMax}
                onChange={(e) => setFMax(e.target.value)}
              />
            </label>
          </div>
          {activeCount > 0 && (
            <div style={{ marginTop: 12 }}>
              <Button variant="ghost" size="sm" icon={<FiX />} onClick={clearFilters}>
                Limpar filtros
              </Button>
            </div>
          )}
        </Card>
        </div>
      )}


      <Table
        loading={loading}
        rows={filtered}
        searchPlaceholder="Buscar por descrição, veículo, oficina…"
        columns={[
          { key: "descricao", label: "Descrição", render: (r) => maintenanceDescription(r) },
          {
            key: "data",
            label: "Data",
            render: (r) => formatDate(r.data || r.date),
            sortAccessor: (r) => new Date(r.data || r.date || 0).getTime(),
          },
          {
            key: "valor",
            label: "Valor",
            render: (r) => formatCurrency(maintenanceValue(r)),
            sortAccessor: (r) => Number(maintenanceValue(r)),
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
