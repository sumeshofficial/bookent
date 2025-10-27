import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminLogin, verifyTokenAdmin } from "../services/auth";

export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      if (!email || !password) return rejectWithValue("Missing fields");

      const response = await adminLogin({ email, password });
      
      localStorage.setItem('adminAccessToken', response.accessToken);

      return response.admin;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const getAdmin = createAsyncThunk(
  "admin/getAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminAccessToken");

      if (!token) return;
      const res = await verifyTokenAdmin(token);

      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error.message ||
        error.response.data.message ||
        error.response.data.error ||
          "Something went wrong"
      );
    }
  }
);

const adminReducer = createSlice({
  name: "admin",
  initialState: {
    admin: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = "";
    },
    logoutAdmin: (state) => {
      state.admin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.isLoading = false;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logoutAdmin, addAdmin } = adminReducer.actions;
export default adminReducer.reducer;
