export function maskPlate(value = "") {
  const clean = String(value).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
  if (clean.length <= 3) return clean;
  return `${clean.slice(0, 3)}-${clean.slice(3)}`;
}

export function formatCurrency(value) {
  const n = Number(value || 0);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("pt-BR");
}

export function isValidYear(y) {
  const n = Number(y);
  return Number.isInteger(n) && n >= 1900 && n <= new Date().getFullYear() + 1;
}
