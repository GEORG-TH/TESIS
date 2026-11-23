import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import AuthLayout from '../../components/AuthLayout';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await forgotPassword(email);

            if (response.status === 200 || response.status === 201) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Solicitud enviada',
                    text: 'Si el correo que ingresaste existe, recibirás un enlace de recuperación.',
                    timer: 3000,
                    timerProgressBar: true
                });
                setEmail('');
            }
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema de conexión. Inténtalo más tarde.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            tag="Recuperación segura"
            tagIcon="lock_reset"
            headline="Recupera el acceso a"
            highlight="tu cuenta"
            subtitle="Te enviaremos un enlace seguro a tu correo corporativo para que vuelvas a gestionar el inventario de tus sedes."
            cards={[
                {
                    icon: 'link',
                    title: 'Enlace seguro de un solo uso',
                    text: 'Restablece tu contraseña desde el enlace que recibirás por correo.',
                },
                {
                    icon: 'verified_user',
                    title: 'Acceso con doble factor',
                    text: 'Tu cuenta sigue protegida con autenticación de dos factores.',
                },
            ]}
            cardText="Ingresa tu correo corporativo y te enviaremos un enlace seguro para restablecer tu contraseña."
            footer={
                <Link to="/" className="lg-back">
                    ¿La recordaste? Volver a iniciar sesión
                </Link>
            }
        >
            <form className="lg-form" onSubmit={handleSubmit}>
                <div>
                    <label className="lg-label" htmlFor="email">Correo electrónico</label>
                    <div className="lg-field">
                        <span className="material-icons lg-field-icon">mail_outline</span>
                        <input
                            className="lg-input"
                            type="email"
                            id="email"
                            placeholder="nombre.apellido@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="lg-submit" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="lg-spinner" />
                            <span>Enviando enlace...</span>
                        </>
                    ) : (
                        <>
                            <span>Enviar enlace</span>
                            <span className="material-icons">arrow_forward</span>
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
