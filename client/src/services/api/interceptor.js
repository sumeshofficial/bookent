import axios from "axios";
import { adminLogout, logout } from "../auth";

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

export const createApiInstance = (type = "user") => {
  const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(
        type === "admin" ? "adminAccessToken" : "accessToken"
      );
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
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
          return await instance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshUrl =
          type === "admin"
            ? `${API_URL}/admin/auth/refresh-token`
            : `${API_URL}/user/auth/refresh-token`;

        const response = await axios.post(
          refreshUrl,
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data;

        localStorage.setItem(
          type === "admin" ? "adminAccessToken" : "accessToken",
          accessToken
        );

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        return await instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        const { default: store } = await import("../../redux/store");

        if (type === "admin") {
          const { logoutAdmin } = await import("../../redux/adminSlice");
          await adminLogout();
          store.dispatch(logoutAdmin());
        } else {
          const { logoutUser } = await import("../../redux/userSlice");
          const { logoutOrganizer } = await import(
            "../../redux/organizerSlice"
          );
          await logout();
          store.dispatch(logoutUser());
          store.dispatch(logoutOrganizer());
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return instance;
};
