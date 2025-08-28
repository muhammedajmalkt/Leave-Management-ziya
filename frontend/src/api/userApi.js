import axios from "axios";

const API = axios.create({   
 baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:7001/api"
    : "https://leave-management-ziya.onrender.com/api",     withCredentials: true, });

export const loginUser = (formData) => API.post("/user/login", formData);
