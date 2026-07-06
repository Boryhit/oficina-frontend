export default function Card({ title, actions, children, className = "", padded = true }) {
  return (
    <div className={`op-card ${className}`}>
      {(title || actions) && (
        <div className="op-card-header">
          {title && <h3 className="op-card-title">{title}</h3>}
          {actions && <div className="op-row">{actions}</div>}
        </div>
      )}
      <div className={padded ? "op-card-body" : ""}>{children}</div>
    </div>
  );
}
