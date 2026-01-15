import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkOrganizer, updateOrganizer } from "../services/organization";

export const getOrganizer = createAsyncThunk(
  "auth/getOrganizer",
  async ({ userId }, { rejectWithValue }) => {
    try {
      if (!userId) return;

      const res = await checkOrganizer({ userId });

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message ||
          error.response.data.error ||
          "Something went wrong"
      );
    }
  }
);

export const updateOrganizerProfile = createAsyncThunk(
  "user/updateOrganizerProfile",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      if (!id || !data) return;
      const res = await updateOrganizer({ id, data });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const organizerSlice = createSlice({
  name: "organizer",
  initialState: {
    organizer: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    addOrganizer: (state, action) => {
      state.organizer = action.payload;
    },
    logoutOrganizer: (state) => {
      state.organizer = null;
    },
    updateOrganizerProfileData: (state, action) => {
      const payload = action.payload;
      if (!payload) return;

      Object.entries(payload).forEach(([key, value]) => {
        if (
          typeof value === "object" &&
          !Array.isArray(value) &&
          value !== null &&
          typeof state.organizer[key] === "object"
        ) {
          state.organizer[key] = {
            ...state.organizer[key],
            ...value,
          };
        } else {
          state.organizer[key] = value;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrganizer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrganizer.fulfilled, (state, action) => {
        state.organizer = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrganizer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateOrganizerProfile.fulfilled, (state, action) => {
        state.organizer = action.payload;
        state.isLoading = false;
      });
  },
});

export const { addOrganizer, logoutOrganizer, updateOrganizerProfileData } =
  organizerSlice.actions;
export default organizerSlice.reducer;
