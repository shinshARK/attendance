import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // Import axios
// Firebase configuration - keep this as you'll need databaseURL
const firebaseConfig = {
  apiKey: "AIzaSyAsVLLYHVtkuFoZt61o7UjevjdnGC9Ai1o",
  //   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:
    "https://auth-70e7d-default-rtdb.asia-southeast1.firebasedatabase.app",
  //   projectId: "YOUR_PROJECT_ID",
  //   storageBucket: "YOUR_PROJECT_ID.appspot.com",
  //   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  //   appId: "YOUR_APP_ID",
};

const databaseURL = firebaseConfig.databaseURL; // Extract databaseURL for REST API calls

// export const logAttendanceData = async (userId, date, attendanceData) => {
export const logAttendanceData = async (date, attendanceData) => {
  console.log("logging attendance data");
  try {
    let userEmail = await AsyncStorage.getItem("email");
    userEmail = userEmail.replace("@", "(at)");
    userEmail = userEmail.replace(".", "(dot)");

    const token = await AsyncStorage.getItem("token");

    const endpointURL = `${databaseURL}/attendanceData/${userEmail}/${date}.json?auth=${token}`; // REST API endpoint
    console.log(endpointURL);
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
