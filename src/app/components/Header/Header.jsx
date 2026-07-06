import { FiMenu, FiLogOut, FiBell } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function Header({ onToggleSidebar, onToggleMobile }) {
  const { user, logout } = useAuth();
  const name = user?.name || user?.email || "Usuário";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="op-header">
      <div className="op-header-left">
        <button
          className="op-icon-btn"
          onClick={() => {
            if (window.innerWidth <= 768) onToggleMobile?.();
            else onToggleSidebar?.();
          }}
          aria-label="Alternar menu"
        >
          <FiMenu />
        </button>
        <div className="op-header-title">Sistema de Gestão de Oficina</div>
      </div>
      <div className="op-header-right">
        <button className="op-icon-btn" aria-label="Notificações">
          <FiBell />
        </button>
        <div className="op-user-chip">
          <div className="op-user-avatar">{initial}</div>
          <span className="op-user-name">{name}</span>
        </div>
        <button className="op-icon-btn" onClick={logout} aria-label="Sair" title="Sair">
          <FiLogOut />
        </button>
      </div>
    </header>
  );
}
