import { useMemo, useState } from "react";
import { FiSearch, FiChevronUp, FiChevronDown } from "react-icons/fi";
import Loading, { EmptyState } from "../Loading/Loading.jsx";

/**
 * columns: [{ key, label, render?, sortable?, sortAccessor? }]
 * rows: array
 * searchKeys: keys to search on (defaults: all string columns)
 */
export default function Table({
  columns,
  rows,
  loading,
  searchable = true,
  searchPlaceholder = "Buscar…",
  pageSize = 10,
  actions,
  emptyLabel = "Nenhum registro encontrado",
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      columns.some((c) => {
        const v = c.searchAccessor ? c.searchAccessor(r) : r[c.key];
        return v != null && String(v).toLowerCase().includes(q);
      }),
    );
  }, [rows, columns, query]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    const acc = col?.sortAccessor || ((r) => r[sortKey]);
    return [...filtered].sort((a, b) => {
      const va = acc(a);
      const vb = acc(b);
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      return sortDir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="op-card">
      {(searchable || actions) && (
        <div className="op-table-toolbar">
          {searchable ? (
            <div className="op-search">
              <FiSearch />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
              />
            </div>
          ) : (
            <div />
          )}
          {actions}
        </div>
      )}
      <div className="op-table-wrap">
        <table className="op-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  onClick={() => c.sortable !== false && toggleSort(c.key)}
                  style={{ width: c.width, textAlign: c.align || "left" }}
                >
                  {c.label}
                  {c.sortable !== false && (
                    <span className="sort-ind">
                      {sortKey === c.key ? (
                        sortDir === "asc" ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )
                      ) : null}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <Loading />
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState label={emptyLabel} />
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => (
                <tr key={row.id || row._id || idx}>
                  {columns.map((c) => (
                    <td key={c.key} style={{ textAlign: c.align || "left" }}>
                      {c.render ? c.render(row) : row[c.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {sorted.length > pageSize && (
        <div className="op-pagination">
          <span>
            Mostrando {start + 1}–{Math.min(start + pageSize, sorted.length)} de {sorted.length}
          </span>
          <div className="op-pagination-controls">
            <button
              className="op-page-btn"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`op-page-btn ${p === currentPage ? "active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}
            <button
              className="op-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
