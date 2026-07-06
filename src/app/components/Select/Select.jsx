export default function Select({ label, error, required, id, children, options, ...rest }) {
  const selectId = id || `sel-${label?.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="op-field">
      {label && (
        <label htmlFor={selectId} className="op-label">
          {label} {required && <span className="req">*</span>}
        </label>
      )}
      <select id={selectId} className={`op-select ${error ? "error" : ""}`} {...rest}>
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          : children}
      </select>
      {error && <span className="op-field-error">{error}</span>}
    </div>
  );
}
