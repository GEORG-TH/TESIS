import axios from "axios";
import axiosInstance from "./axiosConfig";

const API_URL = "http://localhost:8080/api/auth";

export const login = (data) => axios.post(`${API_URL}/login`, data);
export const forgotPassword = (email) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

export const resetPassword = (token, newPassword) => {
  return axios.post(`${API_URL}/reset-password`, { token, newPassword });
};
export const mfaLoginVerify = (payload) => {
  return axios.post(`${API_URL}/mfa/login-verify`, payload);
};

export const setupMfa = () => {
  return axiosInstance.post(`${API_URL}/mfa/setup`);
};

export const verifyMfa = (payload) => {
  return axiosInstance.post(`${API_URL}/mfa/verify`, payload);
};

export const disableMfa = () => {
  return axiosInstance.post("/auth/mfa/disable");
};