import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Card = ({
  children,
  style,
  gradientColors = ["#000", "#fff"],
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
}) => {
  return (
    <LinearGradient
      colors={gradientColors}
      start={gradientStart}
      end={gradientEnd}
      style={[styles.card, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card;
