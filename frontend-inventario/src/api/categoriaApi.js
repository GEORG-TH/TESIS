import axiosInstance from "./axiosConfig";

export const getCategorias = () => axiosInstance.get("/categorias");

export const getCategoria = (id) => axiosInstance.get(`/categorias/${id}`);

export const createCategoria = (data) =>
  axiosInstance.post("/categorias/registrar", data);

export const updateCategoria = (id, data) =>
  axiosInstance.put(`/categorias/actualizar/${id}`, data);

export const deleteCategoria = (id) =>
  axiosInstance.delete(`/categorias/eliminar/${id}`);
