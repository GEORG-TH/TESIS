import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const login = (data) => axios.post(`${API_URL}/login`, data);
export const forgotPassword = (email) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

export const resetPassword = (token, newPassword) => {
  return axios.post(`${API_URL}/reset-password`, { token, newPassword });
};
