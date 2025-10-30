import axiosInstance from "./axiosConfig";

export const getProductos = async () => {
  const response = await axiosInstance.get("/productos");
  return response.data;
};
export const getProducto = async (id) => {
  const response = await axiosInstance.get(`/productos/${id}`);
  return response.data;
};
export const createProducto = (data) =>
  axiosInstance.post("/productos/registrar", data);
export const updateProducto = (id, data) =>
  axiosInstance.put(`/productos/actualizar/${id}`, data);
export const deleteProducto = (id) =>
  axiosInstance.delete(`/productos/eliminar/${id}`);
export const activarProducto = (id) =>
  axiosInstance.patch(`/productos/${id}/activar`);
export const desactivarProducto = (id) =>
  axiosInstance.patch(`/productos/${id}/desactivar`);