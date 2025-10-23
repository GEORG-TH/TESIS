import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/authApi';
import './styles/Login.css';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await forgotPassword(email);
            await Swal.fire({
                icon: 'success',
                title: 'Solicitud enviada',
                text: response.data.message,
                timer: 3000,
                timerProgressBar: true
            });
            setEmail('');
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo enviar la solicitud. Inténtalo de nuevo.'
            });
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
                        <p>Recupera el acceso a tu cuenta.</p>
                    </div>
                </div>

                <p className="card-support-text">
                    Ingresa tu correo corporativo y te enviaremos un enlace seguro para restablecer tu contraseña.
                </p>

                <form className="card-form" onSubmit={handleSubmit}>
                    <label className="input-label" htmlFor="email">Correo electrónico</label>
                    <input
                        className="input"
                        type="email"
                        id="email"
                        placeholder="nombre.apellido@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        disabled={loading}
                        required
                    />

                    <button type="submit" className="button" disabled={loading}>
                        {loading ? 'Enviando enlace...' : 'Enviar enlace'}
                    </button>
                </form>

                <div className="forgot-password-link">
                    <Link to="/">Volver a iniciar sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;