import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";

export default function CustomAlert({
  visible,
  onClose,
  title = "Alert",
  message = "",
  buttons = [{ text: "OK", onPress: () => onClose() }],
  androidStyles = {},
  iosStyles = {},
}) {
  const isIOS = Platform.OS === "ios";

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* full-screen container forwarding events to children */}
      <View style={styles.centerContainer} pointerEvents="box-none">
        {/* Backdrop catches presses outside the alert box */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Alert box sits on top and handles its own touches */}
        <View
          style={[styles.alertBox, isIOS ? styles.iosBox : styles.androidBox]}
        >
          <Text
            style={[
              styles.title,
              isIOS ? iosStyles.title : androidStyles.title,
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.message,
              isIOS ? iosStyles.message : androidStyles.message,
            ]}
          >
            {message}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer} pointerEvents="box-none">
            {buttons.map((btn, i) => (
              <Pressable
                key={i}
                style={styles.button}
                onPress={() => {
                  btn.onPress && btn.onPress();
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>{btn.text}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000080",
  },
  alertBox: {
    width: "80%",
    padding: 20,
    borderRadius: 8,
    zIndex: 10,
  },
  androidBox: {
    backgroundColor: "white",
    elevation: 4,
  },
  iosBox: {
    backgroundColor: "#F8F8F8",
  },
  title: { fontWeight: "bold", marginBottom: 8 },
  message: { marginBottom: 16 },
  buttonContainer: { flexDirection: "row", justifyContent: "flex-end" },
  button: { marginLeft: 12, padding: 8 },
  buttonText: { color: "#007AFF" },
});
