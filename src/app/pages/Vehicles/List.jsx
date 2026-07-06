import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Table from "../../components/Table/Table.jsx";
import Button from "../../components/Button/Button.jsx";
import { useVehicles } from "../../contexts/VehicleContext.jsx";

export default function VehicleList() {
  const { vehicles, loading, fetchAll, remove } = useVehicles();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const askRemove = async (row) => {
    const res = await Swal.fire({
      title: "Excluir veículo?",
      text: `${row.placa || row.plate || "Este veículo"} será removido permanentemente.`,
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
      <Breadcrumb items={[{ label: "Início", to: "/dashboard" }, { label: "Veículos" }]} />
      <div className="op-page-header">
        <div>
          <h1 className="op-page-title">Veículos</h1>
          <div className="op-page-subtitle">Gerencie a frota cadastrada</div>
        </div>
        <Link to="/vehicles/new">
          <Button variant="accent" icon={<FiPlus />}>
            Novo veículo
          </Button>
        </Link>
      </div>

      <Table
        loading={loading}
        rows={vehicles}
        searchPlaceholder="Buscar por placa, modelo, proprietário…"
        columns={[
          { key: "placa", label: "Placa", render: (r) => <strong>{r.placa || r.plate || "—"}</strong> },
          { key: "modelo", label: "Modelo", render: (r) => r.modelo || r.model || "—" },
          { key: "ano", label: "Ano", render: (r) => r.ano || r.year || "—" },
          { key: "proprietario", label: "Proprietário", render: (r) => r.proprietario || r.owner || "—" },
          {
            key: "maintenances",
            label: "Manutenções",
            align: "center",
            render: (r) => (r.maintenances?.length ?? r.maintenancesId?.length ?? r.maintenancesCount ?? 0),
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
                  <button className="op-btn-icon" title="Visualizar" onClick={() => navigate(`/vehicles/${id}`)}>
                    <FiEye />
                  </button>
                  <button className="op-btn-icon" title="Editar" onClick={() => navigate(`/vehicles/${id}/edit`)}>
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
