import axios from "axios";
import { firebaseConfig } from "../../../constants/firebase";
import { syncNTPTime } from "../../backgroundAttendance";
import { store } from "../../../store";

// TODO: how to refresh token automatically?

export async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${firebaseConfig.apiKey}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  const token = response.data.idToken;

  return token;
}
