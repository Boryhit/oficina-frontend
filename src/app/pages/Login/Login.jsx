import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { FiTool, FiMail, FiLock } from "react-icons/fi";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function Login() {
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "E-mail obrigatório";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "E-mail inválido";
    if (!form.password) e.password = "Senha obrigatória";
    else if (form.password.length < 4) e.password = "Mínimo 4 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const ok = await login(form);
    if (ok) navigate("/dashboard", { replace: true });
  };

  return (
    <div className="op-login">
      <aside className="op-login-hero">
        <div className="op-login-brand">
          <div className="mark">
            <FiTool />
          </div>
          OficinaPro
        </div>
        <div className="op-login-tag">
          <h1>Gestão inteligente da sua oficina mecânica</h1>
          <p>
            Controle veículos, oficinas e manutenções em um único painel — moderno, rápido e feito
            para o dia a dia da sua operação.
          </p>
        </div>
        <div style={{ position: "relative", zIndex: 1, color: "#94a3b8", fontSize: 12 }}>
          © {new Date().getFullYear()} OficinaPro
        </div>
      </aside>

      <div className="op-login-form-wrap">
        <div className="op-login-card">
          <h2>Bem-vindo de volta</h2>
          <p className="subtitle">Entre com suas credenciais para acessar o painel.</p>
          <form className="op-form" onSubmit={onSubmit} noValidate>
            <Input
              label="E-mail"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              placeholder="voce@oficina.com"
            />
            <Input
              label="Senha"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              placeholder="••••••••"
            />
            <Button type="submit" variant="primary" loading={loading} disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </Button>
          </form>
          <p
            style={{
              fontSize: 12,
              color: "var(--op-text-muted)",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Suas credenciais são enviadas com segurança e o token JWT é armazenado apenas neste
            dispositivo.
          </p>
        </div>
      </div>
    </div>
  );
}
