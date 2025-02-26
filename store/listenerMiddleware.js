// File: /store/listenerMiddleware.js
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { login } from "./authSlice"; // Import the login async thunk from authSlice
import { setStatus } from "./attendanceSlice"; // Import the setStatus action from attendanceSlice
import { fetchCurrentDayAttendance } from "../utils/firebase/db/attendanceApi";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: login.fulfilled, // Listen for the login.fulfilled action
  effect: async (action, listenerApi) => {
    console.log(
      "Login fulfilled action detected by middleware. Fetching attendance data and hydrating attendanceSlice..."
    );
    const email = action.meta.arg.email; // Extract email from login thunk arguments
    const token = listenerApi.getState().auth.token; // Get token from authSlice

    try {
      const attendanceData = await fetchCurrentDayAttendance(email, token); // Fetch attendance data
      console.log("Attendance Data fetched in middleware:", attendanceData);

      if (attendanceData) {
        listenerApi.dispatch(setStatus(attendanceData)); // Dispatch setStatus with fetched data
        console.log(
          "attendanceSlice hydration dispatched using setStatus with fetched attendanceData."
        );
      }
    } catch (error) {
      console.error("Error fetching attendance data in middleware:", error);
      // Handle error appropriately, e.g., dispatch an error action or log it
    }
  },
});
