import React, { useState } from 'react';
import { setupMfa, verifyMfa, disableMfa } from '../api/authApi'; 
import Swal from 'sweetalert2';
import './styles/MfaSetup.css'; 

const MfaSetup = ({ usuario, onMfaStatusChange }) => {
    const [qrCode, setQrCode] = useState(null);
    const [mfaCode, setMfaCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSetupClick = async () => {
        setIsLoading(true);
        try {
            const response = await setupMfa();
            setQrCode(response.data.qrCodeUri);
            Swal.fire(
                '¡Escanea el QR!',
                'Usa tu app (Google Authenticator, Microsoft Authenticator, Authy) para escanear el código QR.',
                'info'
            );
        } catch (error) {
            Swal.fire('Error', 'No se pudo iniciar la configuración de 2FA.', 'error');
        }
        setIsLoading(false);
    };

    const handleVerifyClick = async () => {
        setIsLoading(true);
        try {
            await verifyMfa({ code: mfaCode });
            Swal.fire(
                '¡Activado!',
                'La autenticación de 2 factores se ha habilitado correctamente.',
                'success'
            );
            setQrCode(null);
            setMfaCode('');
            
            if (onMfaStatusChange) {
                onMfaStatusChange(true);
            }
        } catch (error) {
            Swal.fire('Error', 'Código inválido. Inténtalo de nuevo.', 'error');
        }
        setIsLoading(false);
    };

    const handleDisableClick = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se desactivará la protección de 2 factores de tu cuenta.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                await disableMfa();
                Swal.fire(
                    '¡Desactivado!',
                    'El 2FA se ha deshabilitado.',
                    'success'
                );
                
                if (onMfaStatusChange) {
                    onMfaStatusChange(false);
                }

            } catch (error) {
                Swal.fire('Error', 'No se pudo deshabilitar el 2FA.', 'error');
            }
            setIsLoading(false);
        }
    };

    if (!usuario) {
        return <div className="mfa-setup-container"><p>Cargando seguridad...</p></div>;
    }

    return (
        <div className="mfa-setup-container">
            <h3>Autenticación de 2 Factores (2FA)</h3>
            
            {usuario.mfaEnabled ? (
                <>
                    <p className="mfa-status-active"> Estado: Activado</p>
                    <p className="mfa-description">Tu cuenta está protegida con una capa adicional de seguridad.</p>
                    <button 
                        onClick={handleDisableClick} 
                        disabled={isLoading} 
                        className="mfa-button-disable" 
                    >
                        {isLoading ? 'Desactivando...' : 'Desactivar 2FA'}
                    </button>
                </>

            ) : !qrCode ? (
                <>
                    <p className="mfa-status-inactive"> Estado: Inactivo</p>
                    <p className="mfa-description">Protege tu cuenta con una capa adicional de seguridad.</p>
                    <button 
                        onClick={handleSetupClick} 
                        disabled={isLoading} 
                        className="mfa-button"
                    >
                        {isLoading ? 'Generando...' : 'Activar 2FA'}
                    </button>
                </>

            ) : (
                <div className="mfa-verification">
                    <p className="mfa-description">Escanea el código QR con tu app de autenticación:</p>
                    <img src={qrCode} alt="Código QR para 2FA" className="mfa-qr-code" />
                    <p className="mfa-description">Luego, ingresa el código de 6 dígitos:</p>
                    <input
                        type="text"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        placeholder="Código de 6 dígitos"
                        maxLength={6}
                        className="mfa-input"
                    />
                    <button 
                        onClick={handleVerifyClick} 
                        disabled={isLoading}
                        className="mfa-button verify"
                    >
                        {isLoading ? 'Verificando...' : 'Verificar y Activar'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default MfaSetup;