import { createSlice } from "@reduxjs/toolkit";
import { AttendanceStatus } from "../constants/attendance";

const initialState = {
  status: AttendanceStatus.CHECKING_IN,
  lastUpdated: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const { setStatus } = attendanceSlice.actions;
export default attendanceSlice.reducer;
