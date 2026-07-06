import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ open, title, onClose, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const maxWidth = { sm: 400, md: 560, lg: 780 }[size] || 560;

  return (
    <div className="op-modal-backdrop" onClick={onClose}>
      <div
        className="op-modal"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="op-modal-header">
          <h3 className="op-modal-title">{title}</h3>
          <button className="op-icon-btn" onClick={onClose} aria-label="Fechar">
            <FiX />
          </button>
        </div>
        <div className="op-modal-body">{children}</div>
        {footer && <div className="op-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
