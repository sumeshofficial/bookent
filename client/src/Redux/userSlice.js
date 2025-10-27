import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { editProfile, verifyToken } from "../services/auth";

export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) return;
      const res = await verifyToken(token);

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

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ data }, { rejectWithValue }) => {
    try {
      if (!data) return;
      const res = await editProfile({ data });
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
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
    },
    addError: (state, action) => {
      state.error = action.payload;
    },
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
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logoutUser, addUser, addError } = userSlice.actions;
export default userSlice.reducer;
