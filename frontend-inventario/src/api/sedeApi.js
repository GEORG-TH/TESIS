import axiosInstance from "./axiosConfig";
import { useGlobalStore } from "../store/useGlobalStore";

// --- Multisede: solo el Administrador opera sobre todas las sedes; el resto, solo sobre la suya. ---
export const esAdminActual = () => useGlobalStore.getState().user?.rol === "Administrador";
/** Id numérico de la sede del usuario logueado (null para el Administrador). */
export const sedePropiaId = () => useGlobalStore.getState().user?.sedeId ?? null;
/** Deja solo la sede propia en una lista de sedes (el Administrador ve todas). */
export const soloSedesPropias = (lista = []) =>
  esAdminActual() ? lista : lista.filter((s) => s.idSede === sedePropiaId());
/** Valor inicial (string) para un selector de sede: la sede propia, o "" para el Administrador. */
export const sedeInicial = () => (esAdminActual() || sedePropiaId() == null ? "" : String(sedePropiaId()));

export const getSedes = async () =>{
    const response = await axiosInstance.get("/sedes");
    return response.data;
}
export const getAlmacenes = async () => {
  const response = await axiosInstance.get("/sedes/almacenes");
  return response.data;
};
export const getSede = async (id) => {
    const response = await axiosInstance.get(`/sedes/${id}`);
    return response.data;
}
export const createSede = (data) => axiosInstance.post("/sedes/registrar", data);
export const updateSede = (id, data) => axiosInstance.put(`/sedes/actualizar/${id}`, data);
export const deleteSede = (id) => axiosInstance.delete(`/sedes/eliminar/${id}`);
