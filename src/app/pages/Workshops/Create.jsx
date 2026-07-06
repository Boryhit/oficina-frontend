import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Card from "../../components/Card/Card.jsx";
import WorkshopForm from "./WorkshopForm.jsx";
import { useWorkshops } from "../../contexts/WorkshopContext.jsx";

export default function WorkshopCreate() {
  const { create } = useWorkshops();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (payload) => {
    setSubmitting(true);
    const ok = await create(payload);
    setSubmitting(false);
    if (ok) navigate("/workshops");
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Início", to: "/dashboard" },
          { label: "Oficinas", to: "/workshops" },
          { label: "Nova" },
        ]}
      />
      <div className="op-page-header">
        <h1 className="op-page-title">Cadastrar oficina</h1>
      </div>
      <Card>
        <WorkshopForm onSubmit={onSubmit} submitting={submitting} submitLabel="Cadastrar" />
      </Card>
    </>
  );
}
