import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import LoadingScreen from '../../components/LoadingScreen_login';
import { useForm, Controller } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { mfaLoginVerify } from '../../api/authApi';
import { useGlobalStore } from '../../store/useGlobalStore';
const mfaSchema = z.object({
  mfaCode: z.string().trim().length(6, "El código debe tener 6 dígitos"),
});
const OTP_LENGTH = 6;

// 6 casillas que mantienen el código como un string contiguo de dígitos.
const OtpInput = ({ value = '', onChange, disabled }) => {
    const refs = useRef([]);
    const focusAt = (i) => refs.current[Math.min(i, OTP_LENGTH - 1)]?.focus();

    const handleChange = (e) => {
        const digits = e.target.value.replace(/\D/g, '');
        if (!digits) return;
        const next = (value + digits).slice(0, OTP_LENGTH);
        onChange(next);
        focusAt(next.length);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const next = value.slice(0, -1);
            onChange(next);
            focusAt(next.length);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!digits) return;
        onChange(digits);
        focusAt(digits.length);
    };

    return (
        <div className="lg-otp" onPaste={handlePaste}>
            {Array.from({ length: OTP_LENGTH }, (_, i) => (
                <input
                    key={i}
                    ref={(el) => (refs.current[i] = el)}
                    className="lg-otp-box"
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    maxLength={OTP_LENGTH}
                    value={value[i] || ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => focusAt(value.length)}
                    disabled={disabled}
                    autoFocus={i === 0}
                    aria-label={`Dígito ${i + 1} de ${OTP_LENGTH}`}
                />
            ))}
        </div>
    );
};

const MfaVerify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const loginAction = useGlobalStore((state) => state.login);
    const {
      control,
      handleSubmit,
      formState: { errors: formErrors },
      setError,
    } = useForm({
      resolver: zodResolver(mfaSchema),
    });
    useEffect(() => {
        if (!email) {
            setError("mfaCode", { type: "manual", message: "Sesión inválida. Por favor, inicia sesión de nuevo." });
            setTimeout(() => navigate('/'), 2000);
        }
    }, [email, navigate, setError]);

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
            case "Jefe de Almacén":
                navigate("/dashboard-jefe-almacen");
                break;
            default:
                navigate("/");
                break;
        }
    };

    const handleLoginSuccess = (data) => {
        loginAction(data.token, data.usuario);
        console.log("[Login] Éxito. Guardando en Zustand:", data.usuario);

        navigate("/loading_login");

        setTimeout(() => {
            navigateBasedOnRole(data.usuario?.rol);
        }, 2000);
    };

    const { 
      mutate, 
      isPending, 
      error: mutationError
    } = useMutation({
      mutationFn: mfaLoginVerify,
      onSuccess: (data) => {
        if (!data.success) {
          setError("mfaCode", { type: "manual", message: data.message || "Código 2FA inválido" });
        } else {
          handleLoginSuccess(data);
        }
      },
      onError: (err) => {
        const status = err?.response?.status;
        const message = err?.response?.data?.message || "Error al verificar el código";
        if (status === 401) {
          setError("mfaCode", { type: "manual", message: "Código 2FA inválido" });
        } else {
          setError("mfaCode", { type: "manual", message });
        }
      }
    });

    const onSubmit = (formData) => {
      const payload = {
        email: email,
        code: formData.mfaCode
      };
      mutate(payload);
    };

    const errorMessage = formErrors.mfaCode?.message;

    if (isPending) {
        return <LoadingScreen />;
    }

    return (
        <AuthLayout
            tag="Autenticación multifactor"
            tagIcon="shield"
            headline="Verificación en"
            highlight="dos pasos"
            subtitle="Protegemos el acceso a tu inventario, transferencias y reportes con un segundo factor de autenticación."
            cards={[
                { icon: 'pin', title: 'Código temporal de 6 dígitos', text: 'Se renueva constantemente y es de un solo uso.' },
                { icon: 'smartphone', title: 'Generado en tu app de autenticación', text: 'Ábrela en tu teléfono y copia el código actual.' },
            ]}
            cardText="Verificación en dos pasos."
            error={errorMessage}
            footer={<Link to="/" className="lg-back">← Volver a iniciar sesión</Link>}
        >
            <p className="lg-support">
                Ingresa el código temporal de 6 dígitos generado en tu app de autenticación para{' '}
                <strong>{email || 'tu cuenta'}</strong>.
            </p>

            <form className="lg-form" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="lg-label" style={{ textAlign: 'center' }}>Código de autenticación</label>
                    <Controller
                        name="mfaCode"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <OtpInput
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isPending || !email}
                            />
                        )}
                    />
                </div>

                <button type="submit" className="lg-submit" disabled={isPending || !email}>
                    {isPending ? (
                        <>
                            <span className="lg-spinner" />
                            <span>Validando código…</span>
                        </>
                    ) : (
                        <>
                            <span>Verificar código</span>
                            <span className="material-icons">arrow_forward</span>
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};

export default MfaVerify;