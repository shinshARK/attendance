import { configureStore } from "@reduxjs/toolkit";
import attendanceReducer from "./attendanceSlice";

export const store = configureStore({
  reducer: {
    attendance: attendanceReducer,
  },
});
