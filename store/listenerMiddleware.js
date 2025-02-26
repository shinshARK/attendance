// File: /store/listenerMiddleware.js
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { login } from "./authSlice"; // Import the login async thunk from authSlice
import { setStatus } from "./attendanceSlice"; // Import the setStatus action from attendanceSlice

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: login.fulfilled, // Listen for the login.fulfilled action
  effect: async (action, listenerApi) => {
    console.log(
      "Login fulfilled action detected by middleware. Hydrating attendanceSlice using setStatus..."
    );
    const { attendanceData } = action.payload; // Extract attendanceData from action.payload
    console.log("Attendance Data received in middleware:", attendanceData); // Log received attendanceData

    // Dispatch setStatus action to hydrate attendanceSlice, passing attendanceData as payload

    if (attendanceData) {
      listenerApi.dispatch(setStatus(attendanceData)); // Pass attendanceData to setStatus
      console.log(
        "attendanceSlice hydration dispatched using setStatus with attendanceData."
      );
    }
  },
});
