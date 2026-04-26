import React from "react";
import { useNavigate } from "react-router-dom";
import FiltroAvanzado from "../../components/FiltroAvanzado"; // Asegúrate de apuntar a la ruta correcta

function BusquedaPersonalizadaStock() {
  const navigate = useNavigate();

  // 1. Configuramos las opciones para el Autocomplete
  const sedesConfig = {
    label: "SEDE",
    placeholder: "Escribir código: 1016-Wong",
    options: [
      { label: '1016-Wong', id: 1 },
      { label: '1017-Metro', id: 2 },
    ]
  };

  // 2. Configuramos las opciones de los botones Toggle
  const productoConfig = {
    label: "PRODUCTO",
    opciones: ["SKU", "EAN", "NOMBRE"]
  };

  // 3. Pasamos un arreglo con todos los rangos que necesitamos
  const rangosConfig = ["SUBCATEGORÍA", "CATEGORÍA", "ÁREA"];

  // 4. Capturamos la data cuando el usuario hace clic en "Consultar"
  const handleRealizarConsulta = (dataFiltros) => {
    console.log("Datos listos para enviar a Spring Boot:", dataFiltros);
    // Aquí puedes llamar a tu API con Axios/React-Query usando la dataFiltros
  };

  return (
    <FiltroAvanzado
      titulo="Filtro Avanzado de Consulta de Stock"
      onVolver={() => navigate(-1)}
      onConsultar={handleRealizarConsulta}
      filtroAutocomplete={sedesConfig}
      filtroToggle={productoConfig}
      filtrosRango={rangosConfig}
    />
  );
}

export default BusquedaPersonalizadaStock;