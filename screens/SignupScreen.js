import { useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";

// Removed context import
// import { AuthContext } from "../store/auth-context";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { signup as signupAction } from "../store/authSlice";

function SignupScreen() {
  // const authCtx = useContext(AuthContext); // No longer using context
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const dispatch = useDispatch(); // Get dispatch function
  const error = useSelector((state) => state.auth.error); // Get error from state

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      // const token = await createUser(email, password); // No longer calling util/auth directly
      // authCtx.authenticate(token);
      await dispatch(signupAction({ email, password })).unwrap(); // Dispatch signup action
    } catch (error) {
      Alert.alert(
        "Sign up failed.",
        "Could not create new user, please check your input and try again later!"
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message={"Creating user..."} />;
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
