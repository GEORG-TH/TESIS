import "./styles/Login.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const navigateBasedOnRole = (rol) => {
    switch (rol) {
          case "Administrador":
            navigate("/dashboard-administrador");
            break;
          case "Jefe de Inventario":
            navigate("/dashboard-jefe-inventario");
            break;
          case "Operador de Recepción de Mercadería":
            navigate("/dashboard-operador-recepcion");
            break;
          case "Auditor de Inventarios":
            navigate("/dashboard-auditor-inventarios");
            break;
          case "Operador de Tienda":
            navigate("/dashboard-operador-tienda");
            break;
          default:
            navigate("/usuarios");
            break;
    }
  };
  const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:8080/api/auth/login", { email, pass });

            if (!data.success) {
                setError(data.message || "No se pudo iniciar sesión");
                return;
            }

            if (data.mfaRequired) {
                navigate('/verify-2fa', { state: { email: data.email } });
                
            } else {
                if (data.usuario?.estado_u === 0) {
                    setError("Cuenta desactivada");
                    return;
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("usuario", JSON.stringify(data.usuario));

                navigate("/loading_login");

                setTimeout(() => {
                    navigateBasedOnRole(data.usuario.rol);
                }, 2000);
            }
        } catch (err) {
            const status = err?.response?.status;
            if (status === 403) setError("Cuenta desactivada");
            else if (status === 401) setError("Credenciales inválidas");
            else setError(err?.response?.data?.message || "Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div className="brand-badge">SW+</div>
          <div className="card-header-text">
            <h2>Portal Corporativo SWIC+</h2>
            <p>Inicia sesión con tus credenciales corporativas.</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="card-form" onSubmit={handleLogin}>
          <label className="input-label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="nombre.apellido@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            autoComplete="username"
          />

          <label className="input-label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="********"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
            className="input"
            autoComplete="current-password"
          />

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Validando credenciales…" : "Ingresar"}
          </button>
        </form>

        <div className="forgot-password-link">
         <Link to="/forgot-password">¿Olvidaste tu contraseña? Reestablécela aquí</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;