import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Card from "../../components/Card/Card.jsx";
import MaintenanceForm from "./MaintenanceForm.jsx";
import { useMaintenances } from "../../contexts/MaintenanceContext.jsx";

export default function MaintenanceCreate() {
  const { create } = useMaintenances();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (payload) => {
    setSubmitting(true);
    const ok = await create(payload);
    setSubmitting(false);
    if (ok) navigate("/maintenances");
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Início", to: "/dashboard" },
          { label: "Manutenções", to: "/maintenances" },
          { label: "Nova" },
        ]}
      />
      <div className="op-page-header">
        <h1 className="op-page-title">Cadastrar manutenção</h1>
      </div>
      <Card>
        <MaintenanceForm onSubmit={onSubmit} submitting={submitting} submitLabel="Cadastrar" />
      </Card>
    </>
  );
}
