import api from "./api/interceptor";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const sendOTPForSignup = async (data) => {
  try {
    const { fullname, email, password, role } = data;
    const response = await axios.post(
      `${API_URL}/auth/email/signup`,
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
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const sendOTP = async ({ data, purpose}) => {
  try {
    const { email } = data;
    
    const response = await axios.post(
      `${API_URL}/auth/send-otp`,
      {
        email,
        purpose,
      },
      { withCredentials: true }
    );

    return response.data.message;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const loginUserWithEmail = async (data) => {
  const { email, password } = data;
  try {
    const response = await axios.post(
      `${API_URL}/auth/email/signin`,
      {
        email,
        password,
        purpose: "signin",
      },
      { withCredentials: true }
    );

    return response;
  } catch (error) {
    const message =
      error.response.data.message ||
      error.response.data.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const verifyOtp = async (data) => {
  try {
    const { email, otp, purpose } = data;
    console.log(data);
    const response = await axios.post(
      `${API_URL}/auth/verify-otp`,
      {
        email,
        otp,
        purpose,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    throw new Error(message);
  }
};

export const onResend = async ({ email, purpose }) => {
  try {
    return await axios.post(
      `${API_URL}/auth/resend-otp`,
      { email, purpose },
      { withCredentials: true }
    );
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const verifyToken = async (token) => {
  try {
    return await api.get(
      `/auth/getUser`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      { withCredentials: true }
    );
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    localStorage.removeItem("accessToken");
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const forgotPassword = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const editProfile = async ({ data }) => {
  try {
    console.log(data);
    const response = await api.patch('/me', data);

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};
