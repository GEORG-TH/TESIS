import axiosInstance from "./axiosConfig";

export const getSedes = () => axiosInstance.get("/sedes");
export const getSede = (id) => axiosInstance.get(`/sedes/${id}`);
export const createSede = (data) => axiosInstance.post("/sedes/registrar", data);
export const updateSede = (id, data) => axiosInstance.put(`/sedes/actualizar/${id}`, data);
export const deleteSede = (id) => axiosInstance.delete(`/sedes/eliminar/${id}`);
