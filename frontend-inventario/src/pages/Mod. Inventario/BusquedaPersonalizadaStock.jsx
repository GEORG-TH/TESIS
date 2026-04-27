import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FiltroAvanzado from "../../components/FiltroAvanzado"; // Asegúrate de apuntar a la ruta correcta
import { getSedes } from "../../api/sedeApi"; // Importa la API para obtener las sedes
import { getProductos } from "../../api/productoApi"; // Importa la API de productos
import { getSubcategorias } from "../../api/subcategoriaApi"; // Importa la API de subcategorías
import { getCategorias } from "../../api/categoriaApi"; // Importa la API de categorías
import { getAreas } from "../../api/areaApi"; // Importa la API de áreas

function BusquedaPersonalizadaStock() {
  const navigate = useNavigate();
  const [sedesOptions, setSedesOptions] = useState([]);
  const [productosOptions, setProductosOptions] = useState({ SKU: [], EAN: [], NOMBRE: [] });
  const [subcategoriasOptions, setSubcategoriasOptions] = useState([]);
  const [categoriasOptions, setCategoriasOptions] = useState([]);
  const [areasOptions, setAreasOptions] = useState([]);

  // Fetch sedes data
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const data = await getSedes();
        // Mapear los datos de la API para que coincidan con lo que espera el Autocomplete
        const options = data.map(sede => ({
          label: `${sede.idSede}-${sede.nombreSede}`,
          id: sede.idSede
        }));
        setSedesOptions(options);
      } catch (error) {
        console.error("Error al cargar las sedes:", error);
      }
    };
    
    fetchSedes();
  }, []);

  // Fetch productos data
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        const skus = data.map(p => p.sku).filter(Boolean);
        const eans = data.map(p => p.codEan).filter(Boolean);
        const nombres = data.map(p => p.nombre).filter(Boolean);
        
        setProductosOptions({
          SKU: skus,
          EAN: eans,
          NOMBRE: nombres
        });
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Fetch subcategorias data
  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        const data = await getSubcategorias();
        const options = data.map(subcat => ({
          label: `${subcat.id_subcategoria || subcat.id}-${subcat.nombreSubcat}`,
          id: subcat.id_subcategoria || subcat.id
        }));
        setSubcategoriasOptions(options);
      } catch (error) {
        console.error("Error al cargar las subcategorías:", error);
      }
    };

    fetchSubcategorias();
  }, []);

  // Fetch categorias data
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getCategorias();
        const options = data.map(cat => {
          const id = cat.id_cat || cat.id_categoria;
          const nombre = cat.nombreCat || cat.nombre_categoria;
          return {
            label: `${id}-${nombre}`,
            id: id
          };
        });
        setCategoriasOptions(options);
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  // Fetch areas data
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreas();
        const options = data.map(area => ({
          label: `${area.id_area}-${area.nombreArea}`,
          id: area.id_area
        }));
        setAreasOptions(options);
      } catch (error) {
        console.error("Error al cargar las áreas:", error);
      }
    };

    fetchAreas();
  }, []);

  // 1. Configuramos las opciones para el Autocomplete
  const sedesConfig = {
    label: "SEDE",
    placeholder: "Escribir código o nombre",
    options: sedesOptions
  };

  // 2. Configuramos las opciones de los botones Toggle
  const productoConfig = {
    label: "PRODUCTO",
    opciones: ["SKU", "EAN", "NOMBRE"],
    options: productosOptions
  };

  // 3. Pasamos un arreglo con todos los rangos que necesitamos
  const rangosConfig = [
    { label: "SUBCATEGORÍA", options: subcategoriasOptions },
    { label: "CATEGORÍA", options: categoriasOptions }, 
    { label: "ÁREA", options: areasOptions }
  ];

  // 4. Capturamos la data cuando el usuario hace clic en "Consultar"
  const handleRealizarConsulta = (dataFiltros) => {
    console.log("Datos listos para enviar a Spring Boot:", dataFiltros);
    navigate("/inventario/BusquedaPersonalizadaStock/stock", { state: { filtros: dataFiltros } });
  };

  return (
    <FiltroAvanzado
      titulo="Filtro Avanzado de Consulta de Stock"
      onVolver={() => navigate("/dashboard-inventario")}
      onConsultar={handleRealizarConsulta}
      filtroAutocomplete={sedesConfig}
      filtroToggle={productoConfig}
      filtrosRango={rangosConfig}
    />
  );
}

export default BusquedaPersonalizadaStock;