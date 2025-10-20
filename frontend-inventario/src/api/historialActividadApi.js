import axiosInstance from "./axiosConfig";

export const getHistorialActividad = () => axiosInstance.get("/historial/recientes");