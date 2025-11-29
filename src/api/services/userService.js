import axios from "../axiosInstance";

// semua request terkait users dikumpulkan di sini
export const getUsers = (params = {}) => {
  return axios.get("/users", { params });
};

export const getUserById = (id) => {
  return axios.get(`/users/${id}`);
};

export const createUser = (payload) => {
  return axios.post("/users", payload);
};

export const updateUser = (id, payload) => {
  return axios.put(`/users/${id}`, payload);
};

export const deleteUser = (id) => {
  return axios.delete(`/users/${id}`);
};
