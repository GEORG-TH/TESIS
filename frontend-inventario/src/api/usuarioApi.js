import axiosInstance from "./axiosConfig";

export const getUsuarios = () => axiosInstance.get("/usuarios");
export const getUsuario = (id) => axiosInstance.get(`/usuarios/${id}`);
export const createUsuario = (data) => axiosInstance.post("/usuarios", data);
export const updateUsuario = (id, data) =>
  axiosInstance.put(`/usuarios/${id}`, data);
export const deleteUsuario = (id) => axiosInstance.delete(`/usuarios/${id}`);
export const desactivarUsuarioApi = (id) =>
  axiosInstance.patch(`/usuarios/${id}/desactivar`);
export const activarUsuarioApi = (id) =>
  axiosInstance.patch(`/usuarios/${id}/activar`);
