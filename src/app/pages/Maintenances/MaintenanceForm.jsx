import { useEffect, useState } from "react";
import Input from "../../components/Input/Input.jsx";
import Select from "../../components/Select/Select.jsx";
import Button from "../../components/Button/Button.jsx";
import { useVehicles } from "../../contexts/VehicleContext.jsx";
import { useWorkshops } from "../../contexts/WorkshopContext.jsx";

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente" },
  { value: "agendada", label: "Agendada" },
  { value: "em andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

export default function MaintenanceForm({ initial, onSubmit, submitting, submitLabel = "Salvar" }) {
  const { vehicles, fetchAll: fetchVehicles } = useVehicles();
  const { workshops, fetchAll: fetchWorkshops } = useWorkshops();

  const [form, setForm] = useState({
    description: "",
    data: "",
    value: "",
    status: "pendente",
    vehicleId: "",
    workshopId: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVehicles();
    fetchWorkshops();
  }, [fetchVehicles, fetchWorkshops]);

  useEffect(() => {
    if (!initial) return;
    const rawDate = initial.data || initial.date;
    const iso = rawDate ? new Date(rawDate).toISOString().slice(0, 10) : "";
    const services = initial.services || [];
    setForm({
      description: initial.descricao || initial.description || services.join(", ") || "",
      data: iso,
      value: initial.valor ?? initial.value ?? initial.totalCost ?? "",
      status: (initial.status || "pendente").toLowerCase(),
      vehicleId:
        initial.vehicleId ||
        initial.vehicle_id ||
        initial.vehicle?.id ||
        initial.vehicle?._id ||
        "",
      workshopId:
        initial.workshopId ||
        initial.workshop_id ||
        initial.workshop?.id ||
        initial.workshop?._id ||
        "",
    });
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Descrição obrigatória";
    if (!form.data) e.data = "Data obrigatória";
    if (form.value === "" || Number(form.value) < 0) e.value = "Valor inválido";
    if (!form.vehicleId) e.vehicleId = "Selecione um veículo";
    if (!form.workshopId) e.workshopId = "Selecione uma oficina";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const services = form.description
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    onSubmit({
      services,
      date: form.data,
      totalCost: Number(form.value),
      status: form.status,
      vehicleId: form.vehicleId,
      workshopId: form.workshopId,
    });
  };

  return (
    <form className="op-form" onSubmit={handleSubmit} noValidate>
      <div className="op-form-grid">
        <Input
          label="Descrição"
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Ex: Troca de óleo, Filtros"
          error={errors.description}
        />
        <Input
          label="Data"
          required
          type="date"
          value={form.data}
          onChange={(e) => setForm({ ...form, data: e.target.value })}
          error={errors.data}
        />
        <Input
          label="Valor (R$)"
          required
          type="number"
          step="0.01"
          min="0"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          placeholder="0,00"
          error={errors.value}
        />
        <Select
          label="Status"
          required
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={STATUS_OPTIONS}
        />
        <Select
          label="Veículo"
          required
          value={form.vehicleId}
          onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          error={errors.vehicleId}
        >
          <option value="">Selecione…</option>
          {vehicles.map((v) => (
            <option key={v.id || v._id} value={v.id || v._id}>
              {(v.placa || v.plate) + " — " + (v.modelo || v.model || "")}
            </option>
          ))}
        </Select>
        <Select
          label="Oficina"
          required
          value={form.workshopId}
          onChange={(e) => setForm({ ...form, workshopId: e.target.value })}
          error={errors.workshopId}
        >
          <option value="">Selecione…</option>
          {workshops.map((w) => (
            <option key={w.id || w._id} value={w.id || w._id}>
              {w.nome || w.name}
            </option>
          ))}
        </Select>
      </div>

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
