import axiosInstance from "./axiosConfig";

export const getHistorialActividad = async () => {
  const response = await axiosInstance.get("/historial/recientes");
  return response.data;
};
export const filtrarActividades = async (filtros) => {
  try {
    const response = await axiosInstance.get("/historial/filtrar", { params: filtros });
    return response.data;
  } catch (error) {
    console.error("Error al filtrar actividades:", error);
    throw error;
  }
};