import axios from "axios";

// Set base URL dynamically using environment variables
const api = axios.create({
  baseURL:"https://money-managers-bd.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        localStorage.removeItem("authToken"); 
        window.location.href = "/login"; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;
