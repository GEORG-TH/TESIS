import axiosInstance from "./axiosConfig";

export const getHistorialActividad = async () => {
  const response = await axiosInstance.get("/historial/recientes");
  return response.data;
};