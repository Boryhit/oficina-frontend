import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiSettings, FiTool, FiArrowRight } from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Card from "../../components/Card/Card.jsx";
import Table from "../../components/Table/Table.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import Button from "../../components/Button/Button.jsx";
import { useVehicles } from "../../contexts/VehicleContext.jsx";
import { useWorkshops } from "../../contexts/WorkshopContext.jsx";
import { useMaintenances } from "../../contexts/MaintenanceContext.jsx";
import { formatCurrency, formatDate } from "../../utils/format.js";

export default function Dashboard() {
  const { vehicles, fetchAll: fetchVehicles, loading: lv } = useVehicles();
  const { workshops, fetchAll: fetchWorkshops } = useWorkshops();
  const { maintenances, fetchAll: fetchMaint, loading: lm } = useMaintenances();

  useEffect(() => {
    fetchVehicles();
    fetchWorkshops();
    fetchMaint();
  }, [fetchVehicles, fetchWorkshops, fetchMaint]);

  const totalValue = useMemo(
    () => maintenances.reduce((sum, m) => sum + Number(m.valor || m.value || 0), 0),
    [maintenances],
  );

  const latestMaint = useMemo(
    () =>
      [...maintenances]
        .sort((a, b) => new Date(b.data || b.date || 0) - new Date(a.data || a.date || 0))
        .slice(0, 5),
    [maintenances],
  );

  const latestVehicles = useMemo(
    () =>
      [...vehicles]
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.created_at || 0) -
            new Date(a.createdAt || a.created_at || 0),
        )
        .slice(0, 5),
    [vehicles],
  );

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard" }]} />
      <div className="op-page-header">
        <div>
          <h1 className="op-page-title">Dashboard</h1>
          <div className="op-page-subtitle">Visão geral da operação</div>
        </div>
      </div>

      <div className="op-stat-grid">
        <div className="op-stat">
          <div className="op-stat-icon blue">
            <FiTruck />
          </div>
          <div>
            <div className="op-stat-label">Veículos</div>
            <div className="op-stat-value">{vehicles.length}</div>
          </div>
        </div>
        <div className="op-stat">
          <div className="op-stat-icon orange">
            <FiSettings />
          </div>
          <div>
            <div className="op-stat-label">Oficinas</div>
            <div className="op-stat-value">{workshops.length}</div>
          </div>
        </div>
        <div className="op-stat">
          <div className="op-stat-icon gray">
            <FiTool />
          </div>
          <div>
            <div className="op-stat-label">Manutenções</div>
            <div className="op-stat-value">{maintenances.length}</div>
          </div>
        </div>
        <div className="op-stat">
          <div className="op-stat-icon green">
            <FiTool />
          </div>
          <div>
            <div className="op-stat-label">Valor total (manutenções)</div>
            <div className="op-stat-value" style={{ fontSize: "1.15rem" }}>
              {formatCurrency(totalValue)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr" }}>
        <Card
          title="Últimas manutenções"
          actions={
            <Link to="/maintenances">
              <Button variant="ghost" size="sm" icon={<FiArrowRight />}>
                Ver todas
              </Button>
            </Link>
          }
          padded={false}
        >
          <Table
            loading={lm}
            searchable={false}
            pageSize={5}
            rows={latestMaint}
            columns={[
              { key: "descricao", label: "Descrição", render: (r) => r.descricao || r.description || "—" },
              { key: "data", label: "Data", render: (r) => formatDate(r.data || r.date) },
              {
                key: "valor",
                label: "Valor",
                render: (r) => formatCurrency(r.valor || r.value),
              },
              {
                key: "status",
                label: "Status",
                render: (r) => <Badge status={r.status} />,
              },
            ]}
          />
        </Card>

        <Card
          title="Últimos veículos cadastrados"
          actions={
            <Link to="/vehicles">
              <Button variant="ghost" size="sm" icon={<FiArrowRight />}>
                Ver todos
              </Button>
            </Link>
          }
          padded={false}
        >
          <Table
            loading={lv}
            searchable={false}
            pageSize={5}
            rows={latestVehicles}
            columns={[
              { key: "placa", label: "Placa", render: (r) => r.placa || r.plate || "—" },
              { key: "modelo", label: "Modelo", render: (r) => r.modelo || r.model || "—" },
              { key: "ano", label: "Ano", render: (r) => r.ano || r.year || "—" },
              {
                key: "proprietario",
                label: "Proprietário",
                render: (r) => r.proprietario || r.owner || "—",
              },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
