import React from "react";
import { useGlobalStore } from '../../store/useGlobalStore';
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/Settings.css";

const themeOptions = [
    {
        value: "light",
        label: "Claro",
        emoji: "☀️",
        description: "Modo ideal para espacios bien iluminados",
    },
    {
        value: "dark",
        label: "Oscuro",
        emoji: "🌙",
        description: "Reduce el brillo para trabajar de noche",
    },
];

const fontSizeLabels = {
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
};

const densityOptions = [
    {
        value: "comfortable",
        label: "Cómodo",
        description: "Espaciado amplio en tablas y tarjetas",
    },
    {
        value: "compact",
        label: "Compacto",
        description: "Más información visible en pantalla",
    },
];

const Settings = () => {
    const { 
      theme, fontSize, density, sidebarCollapsed, showFooter,
      setTheme, setFontSize, setDensity, setSidebarCollapsed, setShowFooter 
    } = useGlobalStore();
    return (
        <LayoutDashboard>
            <div className="settings-panel">
                <header className="settings-header">
                    <h2>Preferencias de la Interfaz</h2>
                    <p>
                        Personaliza el aspecto y la lectura del sistema de inventario para
                        adecuarlo a tu espacio de trabajo.
                    </p>
                </header>

                <section className="settings-section">
                    <div className="settings-section-header">
                        <h3>Tema de la aplicación</h3>
                        <p>Selecciona el estilo visual que prefieras para el dashboard.</p>
                    </div>
                    <div className="settings-options settings-options--grid">
                        {themeOptions.map((option) => {
                            const isActive = theme === option.value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`settings-button ${isActive ? "is-active" : ""}`}
                                    onClick={() => setTheme(option.value)}
                                    aria-pressed={isActive}
                                >
                                    <span
                                        className="settings-button-emoji"
                                        aria-hidden="true"
                                    >
                                        {option.emoji}
                                    </span>
                                    <span className="settings-button-text">
                                        <strong>{option.label}</strong>
                                        <small>{option.description}</small>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="settings-section">
                    <div className="settings-section-header">
                        <h3>Tamaño de fuente</h3>
                        <p>Ajusta la escala tipográfica para leer con mayor comodidad.</p>
                    </div>
                    <div className="settings-control">
                        <label className="settings-label" htmlFor="font-size-select">
                            Preferencia de tamaño
                        </label>
                        <div className="settings-select-wrapper">
                            <select
                                id="font-size-select"
                                className="settings-select"
                                value={fontSize}
                                onChange={(event) => setFontSize(event.target.value)}
                            >
                                {Object.entries(fontSizeLabels).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <span className="settings-hint">
                                Se aplica inmediatamente a todos los módulos.
                            </span>
                        </div>
                    </div>
                </section>

                <section className="settings-section">
                    <div className="settings-section-header">
                        <h3>Densidad de interfaz</h3>
                        <p>Ajusta el espacio ocupado por listas y tarjetas según tu preferencia.</p>
                    </div>
                    <div className="settings-options settings-options--grid">
                        {densityOptions.map((option) => {
                            const isActive = density === option.value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`settings-button ${isActive ? "is-active" : ""}`}
                                    onClick={() => setDensity(option.value)}
                                    aria-pressed={isActive}
                                >
                                    <span className="settings-button-text">
                                        <strong>{option.label}</strong>
                                        <small>{option.description}</small>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="settings-section">
                    <div className="settings-section-header">
                        <h3>Barra lateral</h3>
                        <p>Define el estado con el que se mostrará el menú principal al iniciar sesión.</p>
                    </div>
                    <div className="settings-toggle">
                        <div className="settings-toggle-copy">
                            <span className="settings-toggle-title">Colapsada por defecto</span>
                            <p className="settings-toggle-description">
                                Muestra sólo los iconos del menú para tener más espacio de trabajo.
                            </p>
                        </div>
                        <button
                            type="button"
                            className={`settings-switch ${sidebarCollapsed ? "is-on" : ""}`}
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            aria-pressed={sidebarCollapsed}
                        >
                            <span className="settings-switch-track" aria-hidden="true">
                                <span className="settings-switch-thumb" aria-hidden="true" />
                            </span>
                            <span className="settings-switch-label">{sidebarCollapsed ? "Activado" : "Desactivado"}</span>
                        </button>
                    </div>
                </section>

                <section className="settings-section">
                    <div className="settings-section-header">
                        <h3>Visibilidad general</h3>
                        <p>Selecciona los elementos auxiliares que deseas mostrar en el dashboard.</p>
                    </div>
                    <div className="settings-toggle">
                        <div className="settings-toggle-copy">
                            <span className="settings-toggle-title">Mostrar pie de página</span>
                            <p className="settings-toggle-description">
                                Incluye créditos e información del usuario activo en la parte inferior.
                            </p>
                        </div>
                        <button
                            type="button"
                            className={`settings-switch ${showFooter ? "is-on" : ""}`}
                            onClick={() => setShowFooter(!showFooter)}
                            aria-pressed={showFooter}
                        >
                            <span className="settings-switch-track" aria-hidden="true">
                                <span className="settings-switch-thumb" aria-hidden="true" />
                            </span>
                            <span className="settings-switch-label">{showFooter ? "Visible" : "Oculto"}</span>
                        </button>
                    </div>
                </section>

                <footer className="settings-footer">
                    <p>
                        Los cambios se guardan automáticamente en este dispositivo para que
                        retomes tu sesión con la misma experiencia.
                    </p>
                </footer>
            </div>
        </LayoutDashboard>
    );
};

export default Settings;