import axios from "axios";
import { api } from "./axiosSetup";
import { logout } from "../auth";
const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      try {
        const token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });

        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return await api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);

      originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

      processQueue(null, accessToken);

      return await api(originalRequest);
    } catch (refreshError) {

      processQueue(refreshError, null);

      const { default: store, persistor } = await import("../../Redux/store");
      const { logoutUser } = await import("../../Redux/authSlice");

      await logout();
      store.dispatch(logoutUser());
      await persistor.purge();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
