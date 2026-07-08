// Simple CSV exporter — no external deps.
// columns: [{ key, label, render?(row) }]
function escape(v) {
  if (v == null) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",;\n\r]/.test(s) ? `"${s}"` : s;
}

export function exportToCsv(filename, rows, columns) {
  const header = columns.map((c) => escape(c.label ?? c.key)).join(";");
  const body = rows
    .map((r) =>
      columns
        .map((c) => {
          const val = c.render ? c.render(r) : r[c.key];
          // strip React nodes / objects to primitives
          if (val && typeof val === "object" && "props" in val) return "";
          return escape(val);
        })
        .join(";"),
    )
    .join("\n");
  const csv = "\uFEFF" + header + "\n" + body;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
