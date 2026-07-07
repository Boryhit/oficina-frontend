import { Link } from "react-router-dom";
import Button from "../components/Button/Button.jsx";

export default function Unauthorized() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Acesso restrito</h1>
      <p style={{ color: "var(--op-text-muted)", marginBottom: 24 }}>
        Você não possui permissão para acessar esta página.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">Voltar para o Dashboard</Button>
      </Link>
    </div>
  );
}
