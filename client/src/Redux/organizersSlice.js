import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllOrganizers, getAllUsers } from "../services/admin";

export const fetchOrganizers = createAsyncThunk(
  "user/fetchOrganizers",
  async ({ page = 1, limit = 5, search = "", sort = "newest", status = "all" }, { rejectWithValue }) => {
    try {
      const res = await getAllOrganizers({ page, limit, search, sort, status });
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

const organizersSlice = createSlice({
  name: "organizers",
  initialState: {
    organizers: [],
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
      .addCase(fetchOrganizers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizers.fulfilled, (state, action) => {
        state.loading = false;
        state.organizers = action.payload?.organizers;
        state.totalPages = action.payload?.totalPages;
        state.page = action.payload?.page;
      })
      .addCase(fetchOrganizers.rejected, (state, action) => {
        state.loading = false;
        state.loading = false;
        state.error = action.payload.message || "Something went wrong";
      });
  },
});

export const { setPage } = organizersSlice.actions;
export default organizersSlice.reducer;
