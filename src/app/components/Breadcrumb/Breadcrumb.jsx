import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="op-breadcrumb" aria-label="Breadcrumb">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="op-row" style={{ gap: 6 }}>
            {last || !it.to ? (
              <span className="current">{it.label}</span>
            ) : (
              <Link to={it.to}>{it.label}</Link>
            )}
            {!last && (
              <span className="sep">
                <FiChevronRight />
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
