const MAP = {
  concluida: { label: "Concluída", color: "green" },
  concluído: { label: "Concluída", color: "green" },
  concluído: { label: "Concluída", color: "green" },
  finalizada: { label: "Concluída", color: "green" },
  pendente: { label: "Pendente", color: "yellow" },
  agendada: { label: "Agendada", color: "blue" },
  "em andamento": { label: "Em andamento", color: "orange" },
  cancelada: { label: "Cancelada", color: "red" },
};

export default function Badge({ status, children, color }) {
  if (children) return <span className={`op-badge ${color || "gray"}`}>{children}</span>;
  const key = String(status || "").toLowerCase().trim();
  const info = MAP[key] || { label: status || "—", color: "gray" };
  return <span className={`op-badge ${info.color}`}>{info.label}</span>;
}
