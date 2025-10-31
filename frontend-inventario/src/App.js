import './App.css';
import './components/styles/SweetAlert.css';
import React, { useEffect } from "react";
import { useGlobalStore } from './store/useGlobalStore';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import AppRoutes from "./routes";

function App() {
  const theme = useGlobalStore((state) => state.theme);
  const fontSize = useGlobalStore((state) => state.fontSize);
  const density = useGlobalStore((state) => state.density);
  useEffect(() => {
    const body = document.body;
    const themeClasses = ["light-theme", "dark-theme"];
    const fontSizeClasses = [
      "font-size-small",
      "font-size-medium",
      "font-size-large",
    ];
    const densityClasses = ["density-comfortable", "density-compact"]
    body.classList.remove(
      ...themeClasses,
      ...fontSizeClasses,
      ...densityClasses
    );
    body.classList.add(`${theme}-theme`);
    body.classList.add(`font-size-${fontSize}`);
    body.classList.add(`density-${density}`);
  }, [theme, fontSize, density]);
  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
        },
      }),
    [theme]
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Routes>{AppRoutes}</Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;