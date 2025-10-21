import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { verifyToken } from "../services/auth";

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if(!token) return;
      const res = await verifyToken(token);

      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message ||
          error.response.data.error ||
          "Something went wrong"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    accessToken: null,
    error: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = "";
    },
    logoutUser: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logoutUser, addUser } = authSlice.actions;
export default authSlice.reducer;
