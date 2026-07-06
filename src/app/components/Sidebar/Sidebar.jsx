import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiTruck,
  FiTool,
  FiSettings,
} from "react-icons/fi";

const ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
  { to: "/vehicles", label: "Veículos", icon: <FiTruck /> },
  { to: "/workshops", label: "Oficinas", icon: <FiSettings /> },
  { to: "/maintenances", label: "Manutenções", icon: <FiTool /> },
];

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  return (
    <aside className={`op-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "open" : ""}`}>
      <div className="op-sidebar-brand">
        <div className="brand-mark">
          <FiTool />
        </div>
        <span className="brand-text">OficinaPro</span>
      </div>
      <nav className="op-sidebar-nav">
        {ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) => `op-nav-item ${isActive ? "active" : ""}`}
            onClick={onCloseMobile}
          >
            {it.icon}
            <span className="op-nav-label">{it.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="op-sidebar-footer">
        <span className="op-nav-label">© {new Date().getFullYear()} OficinaPro</span>
      </div>
    </aside>
  );
}
