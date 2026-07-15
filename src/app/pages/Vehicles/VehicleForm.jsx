import { useEffect, useState } from "react";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import { maskPlate, isValidYear } from "../../utils/format.js";
import ChipsInput from "../shared/ChipsInput.jsx";
import { useMaintenances } from "../../contexts/MaintenanceContext.jsx";

/**
 * Reusable form for creating/editing a Vehicle.
 * Uses `maintenances` array of ids per API create contract, but also
 * tolerates `maintenancesId` from the API update contract.
 */
export default function VehicleForm({ initial, onSubmit, submitting, submitLabel = "Salvar" }) {
  const { maintenances, fetchAll } = useMaintenances();

  const [form, setForm] = useState({
    placa: "",
    modelo: "",
    ano: "",
    proprietario: "",
    maintenances: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (!initial) return;
    setForm({
      placa: initial.placa || initial.plate || "",
      modelo: initial.modelo || initial.model || "",
      ano: initial.ano || initial.year || "",
      proprietario: initial.proprietario || initial.owner || "",
      maintenances:
        initial.maintenances?.map?.((m) => (typeof m === "object" ? m.id || m._id : m)) ||
        initial.maintenancesId ||
        [],
    });
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.placa.trim()) e.placa = "Placa obrigatória";
    else if (form.placa.replace(/\W/g, "").length < 6) e.placa = "Placa inválida";
    if (!form.modelo.trim()) e.modelo = "Modelo obrigatório";
    if (!form.ano) e.ano = "Ano obrigatório";
    else if (!isValidYear(form.ano)) e.ano = "Ano inválido";
    if (!form.proprietario.trim()) e.proprietario = "Proprietário obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      plate: form.placa,
      model: form.modelo,
      year: Number(form.ano),
      owner: form.proprietario,
      maintenances: form.maintenances,
      maintenancesId: form.maintenances,
    });
  };

  const maintOptions = maintenances.map((m) => ({
    value: m.id || m._id,
    label: `${m.descricao || m.description || m.services?.join?.(", ") || "Manutenção"} — ${m.id || m._id}`,
  }));

  return (
    <form className="op-form" onSubmit={handleSubmit} noValidate>
      <div className="op-form-grid">
        <Input
          label="Placa"
          required
          value={form.placa}
          onChange={(e) => setForm({ ...form, placa: maskPlate(e.target.value) })}
          placeholder="ABC-1234"
          error={errors.placa}
          maxLength={8}
        />
        <Input
          label="Modelo"
          required
          value={form.modelo}
          onChange={(e) => setForm({ ...form, modelo: e.target.value })}
          placeholder="Ex: Fiat Palio 1.0"
          error={errors.modelo}
        />
        <Input
          label="Ano"
          required
          type="number"
          value={form.ano}
          onChange={(e) => setForm({ ...form, ano: e.target.value })}
          placeholder="2020"
          error={errors.ano}
          min={1900}
          max={new Date().getFullYear() + 1}
        />
        <Input
          label="Proprietário"
          required
          value={form.proprietario}
          onChange={(e) => setForm({ ...form, proprietario: e.target.value })}
          placeholder="Nome do proprietário"
          error={errors.proprietario}
        />
      </div>

      <ChipsInput
        label="Manutenções vinculadas"
        options={maintOptions}
        values={form.maintenances}
        onChange={(v) => setForm({ ...form, maintenances: v })}
        placeholder="Selecione manutenções…"
        emptyText="Nenhuma manutenção disponível"
      />

      <div className="op-form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
