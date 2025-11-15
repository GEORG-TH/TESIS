import axiosInstance from "./axiosConfig";

export const registrarRecepcion = (data) => {
  
  return axiosInstance.post("/inventario/recepcion", data);
};