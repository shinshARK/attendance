import { Pressable, StyleSheet, Text } from "react-native";

const Button = ({ title, onPress, style, textStyle, isDisabled }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressedButton,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  pressedButton: {
    opacity: 0.8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Button;
