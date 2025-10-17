import './App.css';
import './components/styles/SweetAlert.css';
import React, { useEffect } from "react";
import { useSettings } from "./components/Mod. Configuracion/SettingsContext";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import AppRoutes from "./routes";

function App() {
  const { settings } = useSettings();

  useEffect(() => {
    const body = document.body;

    const themeClasses = ["light-theme", "dark-theme"];
    const fontSizeClasses = ["font-size-small", "font-size-medium", "font-size-large"];
    const densityClasses = ["density-comfortable", "density-compact"];

    body.classList.remove(...themeClasses, ...fontSizeClasses, ...densityClasses);

    body.classList.add(`${settings.theme}-theme`);
    body.classList.add(`font-size-${settings.fontSize}`);
    body.classList.add(`density-${settings.density}`);
  }, [settings.theme, settings.fontSize, settings.density]);

  return (
    <Router>
      <Routes>{AppRoutes}</Routes>
    </Router>
  );
}

export default App;