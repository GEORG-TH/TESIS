import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';
import AuthLayout from '../../components/AuthLayout';
import Swal from 'sweetalert2';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            Swal.fire('Error', 'No se encontró un token de restablecimiento.', 'error');
            return;
        }
        if (password !== confirmPassword) {
            Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, password);

            await Swal.fire({
                icon: 'success',
                title: '¡Contraseña Actualizada!',
                text: 'Ya puedes iniciar sesión con tu nueva clave.',
                confirmButtonText: 'Ir al Login'
            });

            navigate('/');

        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            const errorMsg = error.response?.data?.message || 'El enlace ha expirado o es inválido.';
            Swal.fire('Error', errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const passwordField = (id, label, value, setValue, show, setShow, placeholder) => (
        <div>
            <label className="lg-label" htmlFor={id}>{label}</label>
            <div className="lg-field">
                <span className="material-icons lg-field-icon">lock</span>
                <input
                    className="lg-input"
                    type={show ? 'text' : 'password'}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoComplete="new-password"
                    disabled={loading}
                    required
                />
                <button
                    type="button"
                    className="lg-eye"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                    <span className="material-icons">{show ? 'visibility_off' : 'visibility'}</span>
                </button>
            </div>
        </div>
    );

    return (
        <AuthLayout
            tag="Nueva contraseña"
            tagIcon="vpn_key"
            headline="Establece una contraseña"
            highlight="segura"
            subtitle="Protege el acceso a tu inventario: recepción, transferencias, conteos y reportes de todas tus sedes."
            cards={[
                { icon: 'check_circle', title: 'Usa una clave robusta', text: 'Combina letras, números y símbolos.' },
                { icon: 'history', title: 'No reutilices claves anteriores', text: 'Cada contraseña debe ser distinta a las que ya usaste.' },
            ]}
            cardText="Crea una nueva contraseña robusta para proteger tu cuenta."
            footer={<Link to="/" className="lg-back">← Volver a iniciar sesión</Link>}
        >
            <form className="lg-form" onSubmit={handleSubmit}>
                {passwordField('password', 'Nueva contraseña', password, setPassword, showPass, setShowPass, 'Ingresa una contraseña segura')}
                {passwordField('confirmPassword', 'Confirmar contraseña', confirmPassword, setConfirmPassword, showConfirm, setShowConfirm, 'Repite la contraseña')}

                <button type="submit" className="lg-submit" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="lg-spinner" />
                            <span>Actualizando...</span>
                        </>
                    ) : (
                        <>
                            <span>Actualizar contraseña</span>
                            <span className="material-icons">arrow_forward</span>
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
