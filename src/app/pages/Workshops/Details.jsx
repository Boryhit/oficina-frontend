import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/Button/Button.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import Table from "../../components/Table/Table.jsx";
import { useWorkshops } from "../../contexts/WorkshopContext.jsx";
import { maintenanceService } from "../../services/maintenance.service.js";
import { formatCurrency, formatDate } from "../../utils/format.js";

const maintenanceDescription = (row) =>
  row.descricao || row.description || row.services?.join?.(", ") || "—";

const maintenanceValue = (row) => row.valor ?? row.value ?? row.totalCost ?? 0;

export default function WorkshopDetails() {
  const { id } = useParams();
  const { getById, remove } = useWorkshops();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [maints, setMaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const w = await getById(id);
        if (!alive) return;
        setWorkshop(w);
        try {
          const m = await maintenanceService.buscarPorOficina(id);
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
      title: "Excluir oficina?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (res.isConfirmed) {
      const ok = await remove(id);
      if (ok) navigate("/workshops");
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Início", to: "/dashboard" },
          { label: "Oficinas", to: "/workshops" },
          { label: "Detalhes" },
        ]}
      />
      <div className="op-page-header">
        <h1 className="op-page-title">Detalhes da oficina</h1>
        <div className="op-row">
          <Link to="/workshops">
            <Button variant="ghost" icon={<FiArrowLeft />}>Voltar</Button>
          </Link>
          <Link to={`/workshops/${id}/edit`}>
            <Button variant="primary" icon={<FiEdit2 />}>Editar</Button>
          </Link>
          <Button variant="danger" icon={<FiTrash2 />} onClick={askRemove}>Excluir</Button>
        </div>
      </div>

      {loading || !workshop ? (
        <Loading />
      ) : (
        <div className="op-stack">
          <Card title="Informações">
            <div className="op-detail-grid">
              <div className="op-detail-item">
                <span className="op-detail-label">Nome</span>
                <span className="op-detail-value">{workshop.nome || workshop.name || "—"}</span>
              </div>
              <div className="op-detail-item">
                <span className="op-detail-label">Endereço</span>
                <span className="op-detail-value">{workshop.endereco || workshop.address || "—"}</span>
              </div>
              <div className="op-detail-item" style={{ gridColumn: "1 / -1" }}>
                <span className="op-detail-label">Especialidades</span>
                <div className="op-row" style={{ marginTop: 4 }}>
                  {(workshop.especialidades || workshop.specialities || workshop.specialties || []).map((s) => (
                    <Badge key={s} color="blue">{s}</Badge>
                  ))}
                  {!(workshop.especialidades?.length || workshop.specialities?.length || workshop.specialties?.length) && "—"}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Manutenções nesta oficina" padded={false}>
            <Table
              rows={maints}
              searchable={false}
              pageSize={10}
              emptyLabel="Sem manutenções registradas para esta oficina"
              columns={[
                { key: "descricao", label: "Descrição", render: (r) => maintenanceDescription(r) },
                { key: "data", label: "Data", render: (r) => formatDate(r.data || r.date) },
                { key: "valor", label: "Valor", render: (r) => formatCurrency(maintenanceValue(r)) },
                { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
              ]}
            />
          </Card>
        </div>
      )}
    </>
  );
}
