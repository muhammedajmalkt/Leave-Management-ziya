import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:7001/api", withCredentials: true, });

export const loginUser = (formData) => API.post("/user/login", formData);
