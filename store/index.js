import { configureStore } from "@reduxjs/toolkit";
import attendanceReducer from "./attendanceSlice";
import authReducer from "./authSlice";
import timeReducer from "./timeSlice";

export const store = configureStore({
  reducer: {
    attendance: attendanceReducer,
    auth: authReducer,
    time: timeReducer,
  },
  devTools: true,
});
