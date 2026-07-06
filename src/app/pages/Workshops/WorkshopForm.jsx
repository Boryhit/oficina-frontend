import { useEffect, useState } from "react";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import ChipsInput from "../shared/ChipsInput.jsx";

export default function WorkshopForm({ initial, onSubmit, submitting, submitLabel = "Salvar" }) {
  const [form, setForm] = useState({ nome: "", endereco: "", especialidades: [] });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initial) return;
    setForm({
      nome: initial.nome || initial.name || "",
      endereco: initial.endereco || initial.address || "",
      especialidades: initial.especialidades || initial.specialties || [],
    });
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.endereco.trim()) e.endereco = "Endereço obrigatório";
    if (!form.especialidades.length) e.especialidades = "Adicione ao menos uma especialidade";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      nome: form.nome,
      endereco: form.endereco,
      especialidades: form.especialidades,
    });
  };

  return (
    <form className="op-form" onSubmit={handleSubmit} noValidate>
      <div className="op-form-grid">
        <Input
          label="Nome"
          required
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          placeholder="Ex: Auto Center Silva"
          error={errors.nome}
        />
        <Input
          label="Endereço"
          required
          value={form.endereco}
          onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          placeholder="Rua, número, bairro, cidade"
          error={errors.endereco}
        />
      </div>

      <ChipsInput
        label="Especialidades *"
        values={form.especialidades}
        onChange={(v) => setForm({ ...form, especialidades: v })}
        placeholder="Ex: Motor, Freios, Suspensão…"
      />
      {errors.especialidades && (
        <span className="op-field-error">{errors.especialidades}</span>
      )}

      <div className="op-form-actions">
        <Button type="button" variant="secondary" onClick={() => window.history.back()} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
