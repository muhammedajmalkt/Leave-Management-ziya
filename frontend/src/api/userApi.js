import axios from "axios";

const API = axios.create({   
  baseURL: "https://leave-management-ziya.onrender.com/api",
//   baseURL: ["https://leave-management-ziya.onrender.com/api","http://localhost:7001/api"],

         withCredentials: true, });

export const loginUser = (formData) => API.post("/user/login", formData);
