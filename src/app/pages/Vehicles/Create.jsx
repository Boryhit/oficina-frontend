import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Card from "../../components/Card/Card.jsx";
import VehicleForm from "./VehicleForm.jsx";
import { useVehicles } from "../../contexts/VehicleContext.jsx";

export default function VehicleCreate() {
  const { create } = useVehicles();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (payload) => {
    setSubmitting(true);
    const ok = await create(payload);
    setSubmitting(false);
    if (ok) navigate("/vehicles");
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Início", to: "/dashboard" },
          { label: "Veículos", to: "/vehicles" },
          { label: "Novo" },
        ]}
      />
      <div className="op-page-header">
        <div>
          <h1 className="op-page-title">Cadastrar veículo</h1>
          <div className="op-page-subtitle">Preencha os dados do veículo</div>
        </div>
      </div>
      <Card>
        <VehicleForm onSubmit={onSubmit} submitting={submitting} submitLabel="Cadastrar" />
      </Card>
    </>
  );
}
