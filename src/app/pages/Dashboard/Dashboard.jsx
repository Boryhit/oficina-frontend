import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiSettings, FiTool, FiArrowRight } from "react-icons/fi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Card from "../../components/Card/Card.jsx";
import Table from "../../components/Table/Table.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import Button from "../../components/Button/Button.jsx";
import { useVehicles } from "../../contexts/VehicleContext.jsx";
import { useWorkshops } from "../../contexts/WorkshopContext.jsx";
import { useMaintenances } from "../../contexts/MaintenanceContext.jsx";
import { formatCurrency, formatDate } from "../../utils/format.js";

const PIE_COLORS = ["#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#0ea5e9", "#f97316"];
const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const maintenanceDescription = (row) =>
  row.descricao || row.description || row.services?.join?.(", ") || "—";

const maintenanceValue = (row) => row.valor ?? row.value ?? row.totalCost ?? 0;

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
    () => maintenances.reduce((sum, m) => sum + Number(maintenanceValue(m)), 0),
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

  // Manutenções por mês (últimos 6 meses)
  const maintByMonth = useMemo(() => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: `${MONTHS[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`,
        total: 0,
        valor: 0,
      });
    }
    maintenances.forEach((m) => {
      const raw = m.data || m.date;
      if (!raw) return;
      const d = new Date(raw);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const b = buckets.find((x) => x.key === key);
      if (b) {
        b.total += 1;
        b.valor += Number(maintenanceValue(m));
      }
    });
    return buckets;
  }, [maintenances]);

  // Custo por oficina (top 6)
  const costByWorkshop = useMemo(() => {
    const map = new Map();
    maintenances.forEach((m) => {
      const wid = m.workshopId || m.oficinaId || m.workshop?.id || m.workshop?._id;
      const wname =
        m.workshop?.nome ||
        m.workshop?.name ||
        workshops.find((w) => (w.id || w._id) === wid)?.nome ||
        workshops.find((w) => (w.id || w._id) === wid)?.name ||
        "Não informado";
      const val = Number(maintenanceValue(m));
      map.set(wname, (map.get(wname) || 0) + val);
    });
    return Array.from(map, ([name, valor]) => ({ name, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 6);
  }, [maintenances, workshops]);

  // Top veículos por número de manutenções
  const topVehicles = useMemo(() => {
    const map = new Map();
    maintenances.forEach((m) => {
      const vid = m.vehicleId || m.veiculoId || m.vehicle?.id || m.vehicle?._id;
      const vname =
        m.vehicle?.placa ||
        m.vehicle?.plate ||
        vehicles.find((v) => (v.id || v._id) === vid)?.placa ||
        vehicles.find((v) => (v.id || v._id) === vid)?.plate ||
        "Sem placa";
      map.set(vname, (map.get(vname) || 0) + 1);
    });
    return Array.from(map, ([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [maintenances, vehicles]);

  const hasData = maintenances.length > 0;

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
          <div className="op-stat-icon blue"><FiTruck /></div>
          <div>
            <div className="op-stat-label">Veículos</div>
            <div className="op-stat-value">{vehicles.length}</div>
          </div>
        </div>
        <div className="op-stat">
          <div className="op-stat-icon orange"><FiSettings /></div>
          <div>
            <div className="op-stat-label">Oficinas</div>
            <div className="op-stat-value">{workshops.length}</div>
          </div>
        </div>
        <div className="op-stat">
          <div className="op-stat-icon gray"><FiTool /></div>
          <div>
            <div className="op-stat-label">Manutenções</div>
            <div className="op-stat-value">{maintenances.length}</div>
          </div>
        </div>
        <div className="op-stat">
          <div className="op-stat-icon green"><FiTool /></div>
          <div>
            <div className="op-stat-label">Valor total (manutenções)</div>
            <div className="op-stat-value" style={{ fontSize: "1.15rem" }}>
              {formatCurrency(totalValue)}
            </div>
          </div>
        </div>
      </div>

      {hasData && (
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", marginBottom: 20 }}>
          <Card title="Manutenções por mês">
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={maintByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" fontSize={12} />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Qtd." stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Custo por oficina">
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={costByWorkshop}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="valor" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Top veículos (manutenções)">
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={topVehicles}
                    dataKey="total"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {topVehicles.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr" }}>
        <Card
          title="Últimas manutenções"
          actions={
            <Link to="/maintenances">
              <Button variant="ghost" size="sm" icon={<FiArrowRight />}>Ver todas</Button>
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
              { key: "descricao", label: "Descrição", render: (r) => maintenanceDescription(r) },
              { key: "data", label: "Data", render: (r) => formatDate(r.data || r.date) },
              { key: "valor", label: "Valor", render: (r) => formatCurrency(maintenanceValue(r)) },
              { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
            ]}
          />
        </Card>

        <Card
          title="Últimos veículos cadastrados"
          actions={
            <Link to="/vehicles">
              <Button variant="ghost" size="sm" icon={<FiArrowRight />}>Ver todos</Button>
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
              { key: "proprietario", label: "Proprietário", render: (r) => r.proprietario || r.owner || "—" },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
