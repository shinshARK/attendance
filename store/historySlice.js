// File: /store/historySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHistoryFromFirebase } from "../utils/firebase/db/historyApi"; // Import the history API function

const initialState = {
  historyData: [],
  loading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchAttendanceHistory = createAsyncThunk(
  "history/fetchAttendanceHistory",
  async (_, { rejectWithValue }) => {
    try {
      const historyData = await fetchHistoryFromFirebase(); // Fetch history data
      return historyData; // Return the fetched history data
    } catch (error) {
      return rejectWithValue({ error: error.message }); // Reject with error message
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceHistory.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.historyData = action.payload; // Update historyData with fetched data
      })
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload.error; // Set error message
        state.historyData = []; // Clear history data on error
      });
  },
});

export default historySlice.reducer;
