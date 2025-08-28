import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const API = axios.create({
  // baseURL: "http://localhost:7001/api",
  baseURL: isDev
    ? "http://localhost:7001/api"
    : "https://leave-management-ziya.onrender.com/api", 
    withCredentials: true,
});

export const  getLeaveById = (id) => API.get(`/leaves/${id}`)
export const createLeave = (leaveData) => API.post('/leaves', leaveData);
export const approveLeaveApi = (id) => API.put(`leaves/${id}/approve`);
export const rejectLeaveApi = (id) => API.put(`leaves/${id}/reject`);
export const getUserLeaves = (userId) => API.get(`/leaves/user/${userId}`);
export const getAllLeaves = () => API.get('/leaves');
