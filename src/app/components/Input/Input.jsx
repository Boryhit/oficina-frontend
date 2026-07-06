export default function Input({ label, error, hint, required, id, ...rest }) {
  const inputId = id || `in-${label?.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="op-field">
      {label && (
        <label htmlFor={inputId} className="op-label">
          {label} {required && <span className="req">*</span>}
        </label>
      )}
      <input id={inputId} className={`op-input ${error ? "error" : ""}`} {...rest} />
      {error && <span className="op-field-error">{error}</span>}
      {!error && hint && <span className="op-field-hint">{hint}</span>}
    </div>
  );
}
