import React, { useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import CustomAlert from "../components/ui/CustomAlert";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { signup as signupAction } from "../store/authSlice";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [
      {
        text: "OK",
        onPress: () => setAlertConfig((prev) => ({ ...prev, visible: false })),
      },
    ],
  });

  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      await dispatch(signupAction({ email, password })).unwrap();
    } catch (err) {
      setAlertConfig({
        visible: true,
        title: "Sign up failed",
        message:
          "Could not create new user, please check your input and try again later!",
        buttons: [
          {
            text: "OK",
            onPress: () =>
              setAlertConfig((prev) => ({ ...prev, visible: false })),
          },
        ],
      });
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message={"Creating user..."} />;
  }

  return (
    <>
      <AuthContent onAuthenticate={signupHandler} />
      <CustomAlert
        visible={alertConfig.visible}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
      />
    </>
  );
}

export default SignupScreen;
