import { useState } from "react";
import { FiX } from "react-icons/fi";

/**
 * Multi-select as chips. If `options` provided, values are picked from a
 * dropdown; otherwise free-text values are accepted (Enter or comma).
 */
export default function ChipsInput({
  label,
  values = [],
  onChange,
  options,
  placeholder = "Adicionar…",
  emptyText,
}) {
  const [text, setText] = useState("");

  const add = (val) => {
    const v = String(val).trim();
    if (!v) return;
    if (values.includes(v)) return;
    onChange([...values, v]);
    setText("");
  };
  const remove = (v) => onChange(values.filter((x) => x !== v));

  const handleKey = (e) => {
    if (options) return;
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(text);
    } else if (e.key === "Backspace" && !text && values.length) {
      remove(values[values.length - 1]);
    }
  };

  const availableOptions = options?.filter((o) => !values.includes(o.value)) || [];
  const labelFor = (v) => options?.find((o) => o.value === v)?.label || v;

  return (
    <div className="op-field">
      {label && <label className="op-label">{label}</label>}
      <div className="op-chips-input">
        {values.map((v) => (
          <span key={v} className="op-chip">
            {labelFor(v)}
            <button type="button" onClick={() => remove(v)} aria-label="Remover">
              <FiX />
            </button>
          </span>
        ))}
        {options ? (
          <select
            value=""
            onChange={(e) => e.target.value && add(e.target.value)}
            style={{ border: "none", outline: "none", background: "transparent", flex: 1, minWidth: 140 }}
          >
            <option value="">
              {availableOptions.length ? placeholder : emptyText || "Sem opções"}
            </option>
            {availableOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            onBlur={() => text && add(text)}
            placeholder={placeholder}
          />
        )}
      </div>
      {!options && (
        <span className="op-field-hint">Pressione Enter ou vírgula para adicionar.</span>
      )}
    </div>
  );
}
