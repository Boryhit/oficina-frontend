import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/Button/Button.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import { useMaintenances } from "../../contexts/MaintenanceContext.jsx";
import { formatCurrency, formatDate } from "../../utils/format.js";

const maintenanceDescription = (row) =>
  row.descricao || row.description || row.services?.join?.(", ") || "—";

const maintenanceValue = (row) => row.valor ?? row.value ?? row.totalCost ?? 0;

export default function MaintenanceDetails() {
  const { id } = useParams();
  const { getById, remove } = useMaintenances();
  const navigate = useNavigate();
  const [m, setM] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getById(id);
        setM(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, getById]);

  const askRemove = async () => {
    const res = await Swal.fire({
      title: "Excluir manutenção?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (res.isConfirmed) {
      const ok = await remove(id);
      if (ok) navigate("/maintenances");
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Início", to: "/dashboard" },
          { label: "Manutenções", to: "/maintenances" },
          { label: "Detalhes" },
        ]}
      />
      <div className="op-page-header">
        <h1 className="op-page-title">Detalhes da manutenção</h1>
        <div className="op-row">
          <Link to="/maintenances">
            <Button variant="ghost" icon={<FiArrowLeft />}>Voltar</Button>
          </Link>
          <Link to={`/maintenances/${id}/edit`}>
            <Button variant="primary" icon={<FiEdit2 />}>Editar</Button>
          </Link>
          <Button variant="danger" icon={<FiTrash2 />} onClick={askRemove}>Excluir</Button>
        </div>
      </div>

      {loading || !m ? (
        <Loading />
      ) : (
        <Card>
          <div className="op-detail-grid">
            <div className="op-detail-item" style={{ gridColumn: "1 / -1" }}>
              <span className="op-detail-label">Descrição</span>
              <span className="op-detail-value">{maintenanceDescription(m)}</span>
            </div>
            <div className="op-detail-item">
              <span className="op-detail-label">Data</span>
              <span className="op-detail-value">{formatDate(m.data || m.date)}</span>
            </div>
            <div className="op-detail-item">
              <span className="op-detail-label">Valor</span>
              <span className="op-detail-value">{formatCurrency(maintenanceValue(m))}</span>
            </div>
            <div className="op-detail-item">
              <span className="op-detail-label">Status</span>
              <span className="op-detail-value">
                <Badge status={m.status} />
              </span>
            </div>
            <div className="op-detail-item">
              <span className="op-detail-label">Veículo</span>
              <span className="op-detail-value">
                {m.vehicle?.placa || m.vehicle?.plate || m.vehicleId || "—"}
              </span>
            </div>
            <div className="op-detail-item">
              <span className="op-detail-label">Oficina</span>
              <span className="op-detail-value">
                {m.workshop?.nome || m.workshop?.name || m.workshopId || "—"}
              </span>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
