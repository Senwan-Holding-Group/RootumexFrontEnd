import axios from "axios";

export const baseURL= import.meta.env.VITE_Base_Link
const api = axios.create({
  baseURL: baseURL,
});

export default api;
