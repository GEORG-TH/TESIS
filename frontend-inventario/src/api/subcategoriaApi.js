import axiosInstance from "./axiosConfig";

export const getSubcategorias = async () => {
  const response = await axiosInstance.get("/subcategorias");
  return response.data;
};

export const getSubcategoria = async (id) => {
  const response = await axiosInstance.get(`/subcategorias/${id}`);
  return response.data;
};

export const createSubcategoria = (data) =>
  axiosInstance.post("/subcategorias/registrar", data);

export const updateSubcategoria = (id, data) =>
  axiosInstance.put(`/subcategorias/actualizar/${id}`, data);

export const deleteSubcategoria = (id) =>
  axiosInstance.delete(`/subcategorias/eliminar/${id}`);
