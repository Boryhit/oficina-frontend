import { useState } from "react";
import { Link } from "react-router-dom";
import { FiTool } from "react-icons/fi";
import { toast } from "react-toastify";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function ForgotPassword() {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Informe um e-mail válido");
      return;
    }
    setError("");
    const res = await forgotPassword(email);
    if (res.success) {
      setSent(true);
      toast.success("Se o e-mail existir, enviamos as instruções.");
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
          <h1>Recuperar acesso</h1>
          <p>Enviaremos um link para redefinição de senha ao seu e-mail.</p>
        </div>
      </aside>

      <div className="op-login-form-wrap">
        <div className="op-login-card">
          <h2>Esqueceu a senha?</h2>
          <p className="subtitle">Informe seu e-mail para receber o link de redefinição.</p>
          {sent ? (
            <div style={{ padding: 16, background: "#ecfdf5", color: "#065f46", borderRadius: 8, fontSize: 14 }}>
              Se houver uma conta com este e-mail, você receberá um link para redefinir sua senha.
            </div>
          ) : (
            <form className="op-form" onSubmit={onSubmit} noValidate>
              <Input
                label="E-mail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                placeholder="voce@oficina.com"
              />
              <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                {loading ? "Enviando…" : "Enviar link"}
              </Button>
            </form>
          )}
          <p style={{ fontSize: 13, marginTop: 16, textAlign: "center" }}>
            <Link to="/login">Voltar para o login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
