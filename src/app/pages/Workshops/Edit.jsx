import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Card from "../../components/Card/Card.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import WorkshopForm from "./WorkshopForm.jsx";
import { useWorkshops } from "../../contexts/WorkshopContext.jsx";

export default function WorkshopEdit() {
  const { id } = useParams();
  const { getById, update } = useWorkshops();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getById(id);
        setInitial(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, getById]);

  const onSubmit = async (payload) => {
    setSubmitting(true);
    const ok = await update(id, payload);
    setSubmitting(false);
    if (ok) navigate(`/workshops/${id}`);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Início", to: "/dashboard" },
          { label: "Oficinas", to: "/workshops" },
          { label: "Editar" },
        ]}
      />
      <div className="op-page-header">
        <h1 className="op-page-title">Editar oficina</h1>
      </div>
      <Card>
        {loading ? (
          <Loading />
        ) : (
          <WorkshopForm
            initial={initial}
            onSubmit={onSubmit}
            submitting={submitting}
            submitLabel="Salvar alterações"
          />
        )}
      </Card>
    </>
  );
}
