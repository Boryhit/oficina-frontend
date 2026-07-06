import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/Button/Button.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import Table from "../../components/Table/Table.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import { useVehicles } from "../../contexts/VehicleContext.jsx";
import { maintenanceService } from "../../services/maintenance.service.js";
import { formatCurrency, formatDate } from "../../utils/format.js";

export default function VehicleDetails() {
  const { id } = useParams();
  const { getById, remove } = useVehicles();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [maints, setMaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const v = await getById(id);
        if (!alive) return;
        setVehicle(v);
        try {
          const m = await maintenanceService.buscarPorVeiculo(id);
          if (alive) setMaints(Array.isArray(m) ? m : m?.data || []);
        } catch {
          if (alive) setMaints([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, getById]);

  const askRemove = async () => {
    const res = await Swal.fire({
      title: "Excluir veículo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (res.isConfirmed) {
      const ok = await remove(id);
      if (ok) navigate("/vehicles");
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Início", to: "/dashboard" },
          { label: "Veículos", to: "/vehicles" },
          { label: "Detalhes" },
        ]}
      />
      <div className="op-page-header">
        <div>
          <h1 className="op-page-title">Detalhes do veículo</h1>
        </div>
        <div className="op-row">
          <Link to="/vehicles">
            <Button variant="ghost" icon={<FiArrowLeft />}>
              Voltar
            </Button>
          </Link>
          <Link to={`/vehicles/${id}/edit`}>
            <Button variant="primary" icon={<FiEdit2 />}>
              Editar
            </Button>
          </Link>
          <Button variant="danger" icon={<FiTrash2 />} onClick={askRemove}>
            Excluir
          </Button>
        </div>
      </div>

      {loading || !vehicle ? (
        <Loading />
      ) : (
        <div className="op-stack">
          <Card title="Informações">
            <div className="op-detail-grid">
              <div className="op-detail-item">
                <span className="op-detail-label">Placa</span>
                <span className="op-detail-value">{vehicle.placa || vehicle.plate || "—"}</span>
              </div>
              <div className="op-detail-item">
                <span className="op-detail-label">Modelo</span>
                <span className="op-detail-value">{vehicle.modelo || vehicle.model || "—"}</span>
              </div>
              <div className="op-detail-item">
                <span className="op-detail-label">Ano</span>
                <span className="op-detail-value">{vehicle.ano || vehicle.year || "—"}</span>
              </div>
              <div className="op-detail-item">
                <span className="op-detail-label">Proprietário</span>
                <span className="op-detail-value">
                  {vehicle.proprietario || vehicle.owner || "—"}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Manutenções deste veículo" padded={false}>
            <Table
              rows={maints}
              searchable={false}
              pageSize={10}
              emptyLabel="Este veículo não possui manutenções registradas"
              columns={[
                {
                  key: "descricao",
                  label: "Descrição",
                  render: (r) => r.descricao || r.description || "—",
                },
                { key: "data", label: "Data", render: (r) => formatDate(r.data || r.date) },
                {
                  key: "valor",
                  label: "Valor",
                  render: (r) => formatCurrency(r.valor || r.value),
                },
                { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
              ]}
            />
          </Card>
        </div>
      )}
    </>
  );
}
