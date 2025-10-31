import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllUsers } from "../services/admin";

export const fetchUsers = createAsyncThunk(
  "user/getUser",
  async ({ role = 'user', page = 1, limit = 5, search = "", sort = "newest", status = "all" }, { rejectWithValue }) => {
    try {
      const res = await getAllUsers({ role, page, limit, search, sort, status });
      return res.data;
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

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.users;
        state.totalPages = action.payload?.totalPages;
        state.page = action.payload?.page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.loading = false;
        state.error = action.payload.message || "Something went wrong";
      });
  },
});

export const { setPage } = usersSlice.actions;
export default usersSlice.reducer;
