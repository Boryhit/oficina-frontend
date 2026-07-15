import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Table from "../../components/Table/Table.jsx";
import Button from "../../components/Button/Button.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import { useWorkshops } from "../../contexts/WorkshopContext.jsx";

export default function WorkshopList() {
  const { workshops, loading, fetchAll, remove } = useWorkshops();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const askRemove = async (row) => {
    const res = await Swal.fire({
      title: "Excluir oficina?",
      text: `${row.nome || row.name || "Esta oficina"} será removida.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (res.isConfirmed) await remove(row.id || row._id);
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Início", to: "/dashboard" }, { label: "Oficinas" }]} />
      <div className="op-page-header">
        <div>
          <h1 className="op-page-title">Oficinas</h1>
          <div className="op-page-subtitle">Locais parceiros e especialidades</div>
        </div>
        <Link to="/workshops/new">
          <Button variant="accent" icon={<FiPlus />}>
            Nova oficina
          </Button>
        </Link>
      </div>

      <Table
        loading={loading}
        rows={workshops}
        searchPlaceholder="Buscar por nome, endereço, especialidade…"
        columns={[
          { key: "nome", label: "Nome", render: (r) => <strong>{r.nome || r.name || "—"}</strong> },
          { key: "endereco", label: "Endereço", render: (r) => r.endereco || r.address || "—" },
          {
            key: "especialidades",
            label: "Especialidades",
            render: (r) => {
              const arr = r.especialidades || r.specialities || r.specialties || [];
              if (!arr.length) return "—";
              return (
                <div className="op-row" style={{ gap: 4 }}>
                  {arr.slice(0, 3).map((s) => (
                    <Badge key={s} color="blue">
                      {s}
                    </Badge>
                  ))}
                  {arr.length > 3 && <Badge color="gray">+{arr.length - 3}</Badge>}
                </div>
              );
            },
          },
          {
            key: "vehiclesCount",
            label: "Veículos",
            align: "center",
            render: (r) =>
              r.vehicles?.length ?? r.vehiclesId?.length ?? r.vehiclesCount ?? 0,
          },
          {
            key: "actions",
            label: "Ações",
            align: "right",
            sortable: false,
            render: (r) => {
              const id = r.id || r._id;
              return (
                <div className="actions">
                  <button className="op-btn-icon" title="Visualizar" onClick={() => navigate(`/workshops/${id}`)}>
                    <FiEye />
                  </button>
                  <button className="op-btn-icon" title="Editar" onClick={() => navigate(`/workshops/${id}/edit`)}>
                    <FiEdit2 />
                  </button>
                  <button className="op-btn-icon danger" title="Excluir" onClick={() => askRemove(r)}>
                    <FiTrash2 />
                  </button>
                </div>
              );
            },
          },
        ]}
      />
    </>
  );
}
