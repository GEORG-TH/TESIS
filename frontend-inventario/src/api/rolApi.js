import axiosInstance from "./axiosConfig";

export const getRoles = async () => {
    return await axiosInstance.get("/roles");
};
export const getRol = async (id) => {
    return await axiosInstance.get(`/roles/${id}`);
};

export const createRol = async (data) => {
    return await axiosInstance.post("/roles", data);
};

export const updateRol = async (id, data) => {
    return await axiosInstance.put(`/roles/${id}`, data);
};

export const deleteRol = async (id) => {
    return await axiosInstance.delete(`/roles/${id}`);
};
