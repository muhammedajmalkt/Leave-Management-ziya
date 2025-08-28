import axios from "axios";

const isDev = import.meta.env.MODE === "development";
// console.log(import.meta.env);

const API = axios.create({
  baseURL: isDev
    ? "http://localhost:7001/api"
    : "https://leave-management-ziya.onrender.com/api",
  withCredentials: true,
});

export const loginUser = (formData) => API.post("/user/login", formData);
