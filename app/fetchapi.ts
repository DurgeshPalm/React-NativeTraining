import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL;
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});



api.interceptors.request.use(
  (config) => {
    console.log(`➡️ ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
