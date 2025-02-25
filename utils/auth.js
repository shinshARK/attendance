import axios from "axios";
import { firebaseConfig } from "../constants/firebase";
import { syncNTPTime } from "./backgroundAttendance";
import { store } from "../store";
// uses firebase

// TODO: how to refresh token automatically?

export async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${firebaseConfig.apiKey}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  // console.log("Response: ");
  // console.log(JSON.stringify(response));

  const token = response.data.idToken;
  let attendanceData = null;

  if (response.status === 200 && mode === "signInWithPassword") {
    const formattedEmail = email.replace("@", "(at)").replace(".", "(dot)"); // Format email
    await syncNTPTime();
    const syncedTime = store.getState().time.ntpTime; // Get NTP time from Redux
    const today = new Date(syncedTime).toISOString().split("T")[0]; // NTP date
    const endpointURL = `${firebaseConfig.databaseURL}/attendanceData/${formattedEmail}/${today}.json?auth=${token}`;

    // console.log(syncedTime);
    // console.log(endpointURL);
    const attendanceResponse = await axios.get(endpointURL, {
      headers: { "Content-Type": "application/json" },
    });

    console.log(JSON.stringify(attendanceResponse.data));
    attendanceData = attendanceResponse.data;
  }

  return { token, attendanceData };
}

export function createUser(email, password) {
  return authenticate("signUp", email, password);
}

export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}
