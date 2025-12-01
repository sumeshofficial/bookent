import axios from "axios";
import { adminApi, api } from "./api/apiSetup";

const API_URL = import.meta.env.VITE_API_URL;

export const sendOTPForSignup = async (data) => {
  const { fullname, email, password, role } = data;
  const response = await axios.post(
    `${API_URL}/user/auth/email/signup`,
    {
      fullname,
      email,
      role,
      password,
      purpose: "signup",
    },
    { withCredentials: true }
  );

  return response.data.message;
};

export const sendOTP = async ({ data, purpose, oldEmail = "" }) => {
  const { email } = data;

  const response = await axios.post(`${API_URL}/user/auth/send-otp`, {
    email,
    purpose,
    oldEmail,
  });

  return response.data.message;
};

export const loginUserWithEmail = async (data) => {
  const { email, password } = data;
  const response = await axios.post(
    `${API_URL}/user/auth/email/signin`,
    {
      email,
      password,
      purpose: "signin",
    },
    { withCredentials: true }
  );

  return response;
};

export const verifyOtp = async (data) => {
  const { email, otp, purpose } = data;
  const response = await axios.post(
    `${API_URL}/user/auth/verify-otp`,
    {
      email,
      otp,
      purpose,
    },
    { withCredentials: true }
  );
  return response.data;
};

export const onResend = async ({ email, purpose }) => {
  return await axios.post(
    `${API_URL}/user/auth/resend-otp`,
    { email, purpose },
    { withCredentials: true }
  );
};

export const verifyToken = async (token) => {
  return await api.get(`/user/account/getUser`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const verifyTokenAdmin = async () => {
  return await adminApi.get("/admin/auth");
};

export const logout = async () => {
  await api.post("/user/auth/logout");
  localStorage.removeItem("accessToken");
};

export const adminLogout = async () => {
  await adminApi.post("/admin/auth/logout");
  localStorage.removeItem("adminAccessToken");
};

export const forgotPassword = async ({ email, password }) => {
  const response = await axios.post(`${API_URL}/user/auth/forgot-password`, {
    email,
    password,
  });

  return response.data;
};

export const editProfile = async ({ data }) => {
  const response = await api.patch("/user/account", data);
  return response.data;
};

// Admin api post
export const adminLogin = async ({ email, password }) => {
  if (!email || !password) return;

  const response = await axios.post(
    `${API_URL}/admin/auth/login`,
    {
      email,
      password,
    },
    { withCredentials: true }
  );

  return response.data;
};
