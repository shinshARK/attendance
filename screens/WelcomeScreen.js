import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// Removed context import
// import { AuthContext } from "../store/auth-context";

// Redux import
import { useSelector } from "react-redux";

function WelcomeScreen() {
  const [fetchedMessage, setFetchedMessage] = useState("");
  // const authCtx = useContext(AuthContext); // No longer using context
  // const token = authCtx.token; // No longer using context directly
  const token = useSelector((state) => state.auth.token); // Get token from Redux state

  useEffect(() => {
    axios
      .get(
        `https://auth-70e7d-default-rtdb.asia-southeast1.firebasedatabase.app/message.json?auth=${token}`
      )
      .then((response) => {
        setFetchedMessage(response.data);
      });
  }, [token]);
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>
      <Text>{fetchedMessage}</Text>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
