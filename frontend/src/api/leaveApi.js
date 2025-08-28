import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:7001/api",
  baseURL:import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const  getLeaveById = (id) => API.get(`/leaves/${id}`)
export const createLeave = (leaveData) => API.post('/leaves', leaveData);
export const approveLeaveApi = (id) => API.put(`leaves/${id}/approve`);
export const rejectLeaveApi = (id) => API.put(`leaves/${id}/reject`);
export const getUserLeaves = (userId) => API.get(`/leaves/user/${userId}`);
export const getAllLeaves = () => API.get('/leaves');
