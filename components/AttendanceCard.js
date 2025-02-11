import { View, Text, StyleSheet } from "react-native";
import Card from "./Card";
import Button from "./Button";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AttendanceStatus, statusColors } from "../constants/attendance";
import * as BackgroundFetch from "expo-background-fetch";
import { performAttendanceCheck } from "../utils/backgroundAttendance"; // Import function
import { BACKGROUND_FETCH_TASK } from "../utils/backgroundAttendance";

function buttonPress(attendanceStatus, setStatus) {
  if (attendanceStatus === AttendanceStatus.CHECKING_IN) {
    setStatus(AttendanceStatus.CHECKED_IN);
    AsyncStorage.setItem(
      "attendanceStatus",
      AttendanceStatus.CHECKED_IN.toString()
    );
  } else if (attendanceStatus === AttendanceStatus.CHECKING_OUT) {
    setStatus(AttendanceStatus.CHECKED_OUT);
    AsyncStorage.setItem(
      "attendanceStatus",
      AttendanceStatus.CHECKED_OUT.toString()
    );
  }
}

const AttendanceCard = ({ name }) => {
  const [status, setStatus] = useState(AttendanceStatus.CHECKING_IN);

  const loadStatus = async () => {
    try {
      const storedStatus = await AsyncStorage.getItem("attendanceStatus");
      console.log(`stored status: ${storedStatus}`);
      if (storedStatus) {
        setStatus(parseInt(storedStatus, 10));
      }
    } catch (err) {
      console.error("Error reading attendance status:", err);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    async function registerBackgroundFetchAsync() {
      try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 1 * 60, // 1 minute in seconds
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log("Background fetch task registered");
      } catch (error) {
        console.error("Error registering background fetch task:", error);
      }
    }
    registerBackgroundFetchAsync();
  }, []);

  const handleManualCheck = async () => {
    console.log("Manually triggering attendance recheck...");
    try {
      await performAttendanceCheck(); // Manually trigger logic
      await loadStatus(); // Reload status from AsyncStorage
      console.log(`current status: ${status}`);
    } catch (error) {
      console.error("Error triggering manual check:", error);
    }
  };

  let buttonText;
  switch (status) {
    case AttendanceStatus.CHECKING_IN:
      buttonText = "Check In";
      break;
    case AttendanceStatus.CHECKED_IN:
      buttonText = "Checked In";
      break;
    case AttendanceStatus.CHECKING_OUT:
      buttonText = "Check Out";
      break;
    case AttendanceStatus.CHECKED_OUT:
      buttonText = "Checked Out";
      break;
    default:
      buttonText = "Check";
  }

  return (
    <Card
      style={styles.attendanceCard}
      gradientColors={statusColors[status] || ["#fff", "#fff"]}
    >
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.info}>
          Current Status: {status} – {new Date().getHours()}
        </Text>
      </View>
      <View style={{ alignSelf: "flex-end", flexDirection: "row", gap: 10 }}>
        <Button
          title={buttonText}
          onPress={buttonPress.bind(this, status, setStatus)}
          style={{ backgroundColor: statusColors[status][1] }}
          isDisabled={status > 1}
        />
        <Button
          title="Refresh"
          onPress={handleManualCheck} // Calls performAttendanceCheck()
          style={{ backgroundColor: "#1E90FF" }}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  attendanceCard: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  info: {
    fontSize: 14,
    color: "lightgray",
  },
});

export default AttendanceCard;
