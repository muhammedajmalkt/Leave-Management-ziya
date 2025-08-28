import axios from "axios";

const API = axios.create({   
    baseURL:import.meta.env.VITE_API_URL,
     withCredentials: true, });

export const loginUser = (formData) => API.post("/user/login", formData);
