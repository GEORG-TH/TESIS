import axiosInstance from "./axiosConfig";

export const getProveedores = () => axiosInstance.get("/proveedores");

export const getProveedor = (id) => axiosInstance.get(`/proveedores/${id}`);

export const createProveedor = (data) =>
  axiosInstance.post("/proveedores/registrar", data);

export const updateProveedor = (id, data) =>
  axiosInstance.put(`/proveedores/actualizar/${id}`, data);

export const deleteProveedor = (id) =>
  axiosInstance.delete(`/proveedores/eliminar/${id}`);

export const activarProveedor = (id) =>
  axiosInstance.put(`/proveedores/activar/${id}`);

export const desactivarProveedor = (id) =>
  axiosInstance.put(`/proveedores/desactivar/${id}`);
