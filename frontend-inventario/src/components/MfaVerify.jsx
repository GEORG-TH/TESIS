import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';
import LoadingScreen from './LoadingScreen_login';

const MfaVerify = () => {
    const [mfaCode, setMfaCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            setError("Sesión inválida. Por favor, inicia sesión de nuevo.");
            setTimeout(() => navigate('/'), 2000);
        }
    }, [email, navigate]);

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

    const handleLoginSuccess = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        navigate("/loading_login");

        setTimeout(() => {
            navigateBasedOnRole(data.usuario.rol);
        }, 2000);
    };

    const handleMfaSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await axios.post("http://localhost:8080/api/auth/mfa/login-verify", {
                email,
                code: mfaCode
            });

            if (!data.success) {
                setError(data.message || "Código 2FA inválido");
                return;
            }

            handleLoginSuccess(data);

        } catch (err) {
            const status = err?.response?.status;
            if (status === 401) setError("Código 2FA inválido");
            else setError(err?.response?.data?.message || "Error al verificar el código");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <div className="brand-badge">SW+</div>
                    <div className="card-header-text">
                        <h2>Portal Corporativo SWIC+</h2>
                        <p>Verificación en dos pasos.</p>
                    </div>
                </div>

                <p className="card-support-text">
                    Ingresa el código temporal de 6 dígitos generado en tu app de autenticación para
                    <strong> {email || 'tu cuenta'}</strong>.
                </p>

                {error && <div className="error-message">{error}</div>}

                <form className="card-form" onSubmit={handleMfaSubmit}>
                    <label className="input-label" htmlFor="mfaCode">Código de autenticación</label>
                    <input
                        className="input"
                        type="text"
                        id="mfaCode"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        disabled={loading || !email}
                        required
                    />

                    <button type="submit" className="button" disabled={loading || !email}>
                        {loading ? 'Validando código…' : 'Verificar código'}
                    </button>
                </form>

                <div className="forgot-password-link">
                    <Link to="/">Volver a iniciar sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default MfaVerify;