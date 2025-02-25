import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // Import axios
import { firebaseConfig } from "../constants/firebase";

const databaseURL = firebaseConfig.databaseURL; // Extract databaseURL for REST API calls

// export const logAttendanceData = async (userId, date, attendanceData) => {
export const logAttendanceData = async (date, attendanceData) => {
  // console.log("logging attendance data:");
  // console.log(JSON.stringify(attendanceData));
  try {
    let userEmail = await AsyncStorage.getItem("email");

    // format agar tidak ada karakter yang tidak diterima firebase
    userEmail = userEmail.replace("@", "(at)");
    userEmail = userEmail.replace(".", "(dot)");

    const token = await AsyncStorage.getItem("token");

    const endpointURL = `${databaseURL}/attendanceData/${userEmail}/${date}.json?auth=${token}`; // REST API endpoint
    // console.log(endpointURL);

    const response = await axios.put(endpointURL, attendanceData, {
      // Use axios.put
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(
      "Attendance data logged to Firebase Realtime Database (REST API using axios):",
      response.data
    ); // Log response data
  } catch (error) {
    console.error(
      "Error logging attendance data to Firebase (REST API using axios):",
      error
    );
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
  }
};
