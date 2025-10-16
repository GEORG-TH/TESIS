import axiosInstance from "./axiosConfig";

export const getAreas = async () => axiosInstance.get("/areas");
export const getArea = async (id) => axiosInstance.get(`/areas/${id}`);
export const createArea = async (data) => axiosInstance.post("/areas/registrar", data);
export const updateArea = async (id, data) => axiosInstance.put(`/areas/actualizar/${id}`, data);
export const deleteArea = async (id) => axiosInstance.delete(`/areas/eliminar/${id}`);

