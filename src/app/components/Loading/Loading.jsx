import { FiInbox } from "react-icons/fi";

export default function Loading({ label = "Carregando…" }) {
  return (
    <div className="op-loading">
      <span className="op-spinner" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ label = "Nenhum registro encontrado", icon }) {
  return (
    <div className="op-empty">
      <div className="op-empty-icon">{icon || <FiInbox />}</div>
      <div>{label}</div>
    </div>
  );
}
