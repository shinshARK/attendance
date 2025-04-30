import React, { useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import CustomAlert from "../components/ui/CustomAlert";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction } from "../store/authSlice";

function LoginScreen() {
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

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      await dispatch(loginAction({ email, password })).unwrap();
    } catch (err) {
      setAlertConfig({
        visible: true,
        title: "Authentication failed!",
        message:
          "Could not log you in. Please check your credentials or try again later!",
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
    return <LoadingOverlay message={"Logging in..."} />;
  }

  return (
    <>
      <AuthContent isLogin onAuthenticate={loginHandler} />
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

export default LoginScreen;
