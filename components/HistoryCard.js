import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "./ui/Card"; // Make sure to use the Card component correctly - it should now just be a styled View
import { Colors } from "../constants/styles"; // Keep Colors import for general styles

const HistoryCard = ({
  date,
  checkInTime,
  checkOutTime,
  status,
  dinasDescription,
}) => {
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedCheckInTime = checkInTime
    ? new Date(checkInTime).toLocaleTimeString()
    : "-";
  const formattedCheckOutTime = checkOutTime
    ? new Date(checkOutTime).toLocaleTimeString()
    : "-";

  let statusText;
  let statusColorStyle; // Style for status text color

  switch (status) {
    case 0:
      statusText = "Checking In";
      statusColorStyle = styles.checkingInStatus; // Define status-specific text color styles
      break;
    case 1:
      statusText = "Checking Out";
      statusColorStyle = styles.checkingOutStatus; // Define status-specific text color styles
      break;
    case 2:
      statusText = "Checked In";
      statusColorStyle = styles.checkedInStatus; // Define status-specific text color styles
      break;
    case 3:
      statusText = "Checked Out";
      statusColorStyle = styles.checkedOutStatus; // Define status-specific text color styles
      break;
    default:
      statusText = "Unknown";
      statusColorStyle = styles.unknownStatus; // Define status-specific text color styles
  }

  return (
    <Card gradientColors={["#fff", "#fff"]} style={[styles.historyCard]}>
      {/* Apply solid background via historyCard style */}
      <View style={styles.headerContainer}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={[styles.status, statusColorStyle]}>{statusText}</Text>
        {/* Apply status-specific text color */}
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.timeRow}>
          <Text style={styles.infoLabel}>Check-in:</Text>
          <Text style={styles.infoText}>{formattedCheckInTime}</Text>
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.infoLabel}>Check-out:</Text>
          <Text style={styles.infoText}>{formattedCheckOutTime}</Text>
        </View>
        {dinasDescription && (
          <View style={styles.dinasContainer}>
            <Text style={styles.infoLabel}>Keterangan Dinas:</Text>
            <Text style={styles.dinasText}>{dinasDescription}</Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  historyCard: {
    margin: 10,
    padding: 15,
    backgroundColor: "#f9f9f9", // Light gray background for the card - SOLID COLOR NOW
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Dark gray for date text
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  checkingInStatus: {
    color: "#FFD700", // Gold for "Checking In" status
  },
  checkingOutStatus: {
    color: "#1E90FF", // DodgerBlue for "Checking Out" status
  },
  checkedInStatus: {
    color: "#32CD32", // LimeGreen for "Checked In" status
  },
  checkedOutStatus: {
    color: "#808080", // Gray for "Checked Out" status
  },
  unknownStatus: {
    color: "#555", // Darker Gray for "Unknown" status
  },
  infoContainer: {
    // marginTop: 10,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: "#555", // Medium dark gray for info labels
  },
  infoText: {
    fontSize: 14,
    color: "#777", // Slightly lighter gray for info text
  },
  dinasContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc", // Light gray separator
  },
  dinasText: {
    fontSize: 14,
    color: "#666", // Gray for Dinas text
  },
});

export default HistoryCard;
