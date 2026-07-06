export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  icon,
  type = "button",
  onClick,
  ...rest
}) {
  const cls = ["op-btn", `op-btn-${variant}`, size === "sm" ? "op-btn-sm" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? <span className="op-spinner sm" /> : icon}
      {children}
    </button>
  );
}
