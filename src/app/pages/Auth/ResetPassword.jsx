import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiTool } from "react-icons/fi";
import { toast } from "react-toastify";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function ResetPassword() {
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!token) e.password = "Token de recuperação ausente ou inválido";
    if (!form.password) e.password = "Senha obrigatória";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.confirm !== form.password) e.confirm = "As senhas não coincidem";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const res = await resetPassword({ token, password: form.password });
    if (res.success) {
      toast.success("Senha redefinida! Faça login.");
      navigate("/login", { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="op-login">
      <aside className="op-login-hero">
        <div className="op-login-brand">
          <div className="mark"><FiTool /></div>
          OficinaPro
        </div>
        <div className="op-login-tag">
          <h1>Nova senha</h1>
          <p>Escolha uma nova senha segura para sua conta.</p>
        </div>
      </aside>

      <div className="op-login-form-wrap">
        <div className="op-login-card">
          <h2>Redefinir senha</h2>
          <p className="subtitle">Digite e confirme sua nova senha.</p>
          <form className="op-form" onSubmit={onSubmit} noValidate>
            <Input
              label="Nova senha"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
            />
            <Input
              label="Confirmar senha"
              type="password"
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              error={errors.confirm}
            />
            <Button type="submit" variant="primary" loading={loading} disabled={loading || !token}>
              {loading ? "Salvando…" : "Salvar nova senha"}
            </Button>
          </form>
          <p style={{ fontSize: 13, marginTop: 16, textAlign: "center" }}>
            <Link to="/login">Voltar para o login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
