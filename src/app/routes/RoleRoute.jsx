import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function RoleRoute({ roles = [], children }) {
  const { isAuthenticated, hasRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const allowed = roles.length === 0 || roles.some((r) => hasRole(r));
  if (!allowed) return <Navigate to="/unauthorized" replace />;
  return children;
}
