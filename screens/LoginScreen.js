import { useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";

// Removed context import
// import { AuthContext } from "../store/auth-context";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction } from "../store/authSlice";

function LoginScreen() {
  // const authCtx = useContext(AuthContext); // No longer using context
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const dispatch = useDispatch(); // Get dispatch function

  const error = useSelector((state) => state.auth.error); // Get error from state

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      // const token = await login(email, password); // No longer calling util/auth directly
      // authCtx.authenticate(token);
      await dispatch(loginAction({ email, password })).unwrap(); // Dispatch login action
    } catch (error) {
      Alert.alert(
        "Authentication failed!",
        "Could not log you in. Please check your credentials or try again later!"
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message={"Logging in..."} />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
