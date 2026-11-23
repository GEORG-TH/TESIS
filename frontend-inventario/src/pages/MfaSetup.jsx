import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { setupMfa, verifyMfa, disableMfa } from '../api/authApi';
import { useGlobalStore } from '../store/useGlobalStore';
import { toast } from 'react-hot-toast';
import {
    Box,
    Button,
    TextField,
    Typography,
    Chip,
    Stack,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const MONO = '"JetBrains Mono", ui-monospace, monospace';

const MfaSetup = () => {
    const usuario = useGlobalStore((state) => state.user);
    const setUser = useGlobalStore((state) => state.setUser);

    const [qrCode, setQrCode] = useState(null);
    const [mfaCode, setMfaCode] = useState('');
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    const { mutate: handleSetup, isPending: isSetupPending } = useMutation({
        mutationFn: setupMfa,
        onSuccess: (response) => {
            setQrCode(response.qrCodeUri);
            // react-hot-toast no tiene toast.info (lanzaba un error); se usa toast() con icono.
            toast('Escanea el código QR con tu app de autenticación.', { icon: 'ℹ️' });
        },
        onError: () => {
            toast.error('No se pudo iniciar la configuración de 2FA.');
        },
    });

    const { mutate: handleVerify, isPending: isVerifyPending } = useMutation({
        mutationFn: verifyMfa,
        onSuccess: () => {
            toast.success('¡2FA habilitado correctamente!');
            setQrCode(null);
            setMfaCode('');
            setUser({ ...usuario, mfaEnabled: true });
        },
        onError: () => {
            toast.error('Código inválido. Inténtalo de nuevo.');
        },
    });

    const { mutate: handleDisable, isPending: isDisablePending } = useMutation({
        mutationFn: disableMfa,
        onSuccess: () => {
            toast.success('El 2FA se ha deshabilitado.');
            setConfirmOpen(false);
            setUser({ ...usuario, mfaEnabled: false });
        },
        onError: () => {
            toast.error('No se pudo deshabilitar el 2FA.');
            setConfirmOpen(false);
        },
    });

    const onVerifySubmit = (e) => {
        e.preventDefault();
        if (mfaCode.length === 6) {
            handleVerify({ code: mfaCode });
        }
    };

    if (!usuario) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    const activo = !!usuario.mfaEnabled;
    const color = activo ? 'success' : 'warning';

    return (
        <Box>
            {/* Estado actual */}
            <Stack
                direction="row" spacing={1.5} alignItems="center"
                sx={{
                    p: 1.5, mb: 2, borderRadius: 2, border: '1px solid',
                    borderColor: (t) => alpha(t.palette[color].main, 0.4),
                    bgcolor: (t) => alpha(t.palette[color].main, 0.08),
                }}
            >
                <Box
                    sx={{
                        width: 40, height: 40, borderRadius: '10px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0, color: `${color}.main`,
                        bgcolor: (t) => alpha(t.palette[color].main, 0.16),
                    }}
                >
                    {activo ? <VerifiedUserIcon /> : <ShieldIcon />}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {activo ? 'Tu cuenta está protegida' : 'Protección adicional desactivada'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {activo
                            ? 'Se pedirá un código al iniciar sesión.'
                            : 'Agrega una capa extra de seguridad a tu cuenta.'}
                    </Typography>
                </Box>
                <Chip
                    size="small" label={activo ? 'Activado' : 'Inactivo'} color={color}
                    sx={{ fontFamily: MONO, fontSize: 11, fontWeight: 600 }}
                />
            </Stack>

            {activo ? (
                <LoadingButton
                    variant="outlined"
                    color="error"
                    onClick={() => setConfirmOpen(true)}
                    loading={isDisablePending}
                    fullWidth
                >
                    Desactivar 2FA
                </LoadingButton>
            ) : !qrCode ? (
                <LoadingButton
                    variant="contained"
                    onClick={() => handleSetup()}
                    loading={isSetupPending}
                    fullWidth
                >
                    Activar 2FA
                </LoadingButton>
            ) : (
                <Box
                    component="form"
                    onSubmit={onVerifySubmit}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                >
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        1. Escanea el código QR con tu app de autenticación.
                    </Typography>
                    {/* El QR necesita fondo blanco para poder escanearse en modo oscuro */}
                    <Box
                        sx={{
                            p: 1.5, bgcolor: '#fff', borderRadius: 2, border: 1, borderColor: 'divider',
                            lineHeight: 0, maxWidth: '100%',
                        }}
                    >
                        <Box
                            component="img"
                            src={qrCode}
                            alt="Código QR para 2FA"
                            sx={{ width: 190, height: 190, maxWidth: '100%' }}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        2. Ingresa el código de 6 dígitos que genera la app.
                    </Typography>
                    <TextField
                        placeholder="000000"
                        variant="outlined"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        inputProps={{
                            maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*', autoComplete: 'one-time-code',
                            style: { textAlign: 'center', letterSpacing: '0.5em', fontFamily: MONO, fontSize: 22, fontWeight: 700 },
                        }}
                        sx={{ width: '100%', maxWidth: 260 }}
                    />
                    <Stack direction="row" spacing={1} sx={{ width: '100%', maxWidth: 260 }}>
                        <Button
                            variant="text" color="inherit"
                            onClick={() => { setQrCode(null); setMfaCode(''); }}
                            disabled={isVerifyPending}
                        >
                            Cancelar
                        </Button>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={isVerifyPending}
                            disabled={mfaCode.length !== 6}
                            fullWidth
                        >
                            Verificar y activar
                        </LoadingButton>
                    </Stack>
                </Box>
            )}

            <Dialog open={isConfirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Se desactivará la protección de 2 factores de tu cuenta.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} disabled={isDisablePending}>
                        Cancelar
                    </Button>
                    <LoadingButton
                        color="error"
                        onClick={() => handleDisable()}
                        loading={isDisablePending}
                    >
                        Sí, desactivar
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MfaSetup;
