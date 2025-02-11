import { View, Text, StyleSheet } from "react-native";
import Card from "./Card";
import Button from "./Button";
import { useEffect } from "react";
import { AttendanceStatus, statusColors } from "../constants/attendance";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { performAttendanceCheck } from "../utils/backgroundAttendance"; // Import function
import { BACKGROUND_FETCH_TASK } from "../utils/backgroundAttendance";
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "../store/attendanceSlice";
import IconButton from "./IconButton";

const AttendanceCard = ({ name }) => {
  const dispatch = useDispatch();
  const { status, lastUpdated } = useSelector((state) => state.attendance);

  useEffect(() => {
    async function registerBackgroundFetchAsync() {
      try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 1 * 60, // 1 minute in seconds
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log("Background fetch task registered");
        console.log(await BackgroundFetch.getStatusAsync());
        console.log(
          await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)
        );
      } catch (error) {
        console.error("Error registering background fetch task:", error);
      }
    }
    registerBackgroundFetchAsync();
  }, []);

  const handleButtonPress = () => {
    let newStatus;
    if (status === AttendanceStatus.CHECKING_IN) {
      newStatus = AttendanceStatus.CHECKED_IN;
    } else if (status === AttendanceStatus.CHECKING_OUT) {
      newStatus = AttendanceStatus.CHECKED_OUT;
    } else {
      return;
    }
    dispatch(setStatus(newStatus));
  };

  const handleManualCheck = async () => {
    console.log("Manually triggering attendance recheck...");
    try {
      await performAttendanceCheck();
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

  let content = "";
  let date = new Date(lastUpdated);

  if (
    status === AttendanceStatus.CHECKED_IN ||
    status === AttendanceStatus.CHECKING_OUT
  ) {
    content = `Checked in at: ${date}`;
  } else if (status === AttendanceStatus.CHECKED_OUT) {
    content = `Checked out at: ${date}`;
  }

  return (
    <Card
      style={styles.attendanceCard}
      gradientColors={statusColors[status] || ["#fff", "#fff"]}
    >
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.name}>{name}</Text>
          <IconButton
            icon={"refresh-circle-outline"}
            size={30}
            color={"white"}
            onPress={handleManualCheck}
          />
        </View>
        <Text style={styles.info}>{content}</Text>
      </View>
      <View style={{ alignSelf: "flex-end", flexDirection: "row", gap: 10 }}>
        <Button
          title={buttonText}
          onPress={handleButtonPress}
          style={{ backgroundColor: statusColors[status][1] }}
          isDisabled={status > 1}
        />
        {/* <Button
          title="Refresh"
          onPress={handleManualCheck} // Calls performAttendanceCheck()
          style={{ backgroundColor: "#1E90FF" }}
        /> */}
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
    color: "white",
  },
});

export default AttendanceCard;
