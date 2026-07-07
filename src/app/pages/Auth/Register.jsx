import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiTool } from "react-icons/fi";
import { toast } from "react-toastify";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function Register() {
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nome obrigatório";
    if (!form.email.trim()) e.email = "E-mail obrigatório";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "E-mail inválido";
    if (!form.password) e.password = "Senha obrigatória";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.confirm !== form.password) e.confirm = "As senhas não coincidem";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const res = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    if (res.success) {
      toast.success("Cadastro realizado com sucesso!");
      navigate(res.autoLogin ? "/dashboard" : "/login", { replace: true });
    } else {
      toast.error(res.message || "Não foi possível concluir o cadastro");
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
          <h1>Crie sua conta</h1>
          <p>Comece a gerenciar veículos, oficinas e manutenções em minutos.</p>
        </div>
      </aside>

      <div className="op-login-form-wrap">
        <div className="op-login-card">
          <h2>Criar conta</h2>
          <p className="subtitle">Preencha seus dados para acessar o painel.</p>
          <form className="op-form" onSubmit={onSubmit} noValidate>
            <Input
              label="Nome completo"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              placeholder="Seu nome"
            />
            <Input
              label="E-mail"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              placeholder="voce@oficina.com"
            />
            <Input
              label="Senha"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              placeholder="Mínimo 6 caracteres"
            />
            <Input
              label="Confirmar senha"
              type="password"
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              error={errors.confirm}
              placeholder="Repita a senha"
            />
            <Button type="submit" variant="primary" loading={loading} disabled={loading}>
              {loading ? "Criando…" : "Criar conta"}
            </Button>
          </form>
          <p style={{ fontSize: 13, marginTop: 16, textAlign: "center" }}>
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
