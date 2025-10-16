import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return <Navigate to="/" />;

  // Soporta 'usuario.rol' como string o como objeto { nombreRol: string }
  const rolRaw = usuario.rol;
  const rolUsuario = typeof rolRaw === "string" ? rolRaw : rolRaw || null;

  if (!rolUsuario || !roles.includes(rolUsuario)) {
    return <Navigate to="/no-autorizado" />;
  }

  return children;
}

export default ProtectedRoute;
