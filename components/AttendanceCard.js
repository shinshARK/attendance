import { View, Text, StyleSheet } from "react-native";
import Card from "./Card";
import Button from "./Button";
import { useState, useEffect } from "react";
import { AttendanceStatus, statusColors } from "../constants/attendance";

import NTPSync from "@ruanitto/react-native-ntp-sync";
function buttonPress(attendanceStatus, setStatus) {
  if (attendanceStatus === AttendanceStatus.CHECKING_IN) {
    // checkIn()
    setStatus(AttendanceStatus.CHECKED_IN);
  } else if (attendanceStatus === AttendanceStatus.CHECKED_IN) {
    // later this will be time-based
    setStatus(AttendanceStatus.CHECKING_OUT);
  } else if (attendanceStatus === AttendanceStatus.CHECKING_OUT) {
    // checkOut()
    setStatus(AttendanceStatus.CHECKED_OUT);
  } else if (attendanceStatus === AttendanceStatus.CHECKED_OUT) {
    // later this will be time-based
    setStatus(AttendanceStatus.CHECKING_IN);
  }
}

const AttendanceCard = ({ name, onCheckIn }) => {
  const [status, setStatus] = useState(AttendanceStatus.CHECKING_IN); // checkingIn | checkedIn | checkingOut | checkedOut

  const ntp = new NTPSync({
    servers: [
      //   { server: "time.google.com", port: 123 },
      { server: "id.pool.ntp.org", port: 123 },
      { server: "sg.pool.ntp.org", port: 123 },
    ],
    syncInterval: 300000, // 5 minutes (in milliseconds)
    syncOnCreation: true, // Auto-sync immediately
    autoSync: true, // Enable background syncing
  });

  const synchronizedTime = ntp.getTime();
  console.log(new Date(synchronizedTime));
  console.log("Synchronized Time:", new Date(synchronizedTime).getHours());

  // TODO: time-based state changes

  let buttonText;

  if (status === AttendanceStatus.CHECKING_IN) {
    buttonText = "Check In";
  } else if (status === AttendanceStatus.CHECKED_IN) {
    buttonText = "Checked In";
  } else if (status === AttendanceStatus.CHECKING_OUT) {
    buttonText = "Check Out";
  } else if (status === AttendanceStatus.CHECKED_OUT) {
    buttonText = "Checked Out";
  }

  return (
    <Card
      style={styles.attendanceCard}
      gradientColors={statusColors[status] || ["#fff, #fff"]}
    >
      <View>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={{ alignSelf: "flex-end" }}>
        <Button
          title={buttonText}
          onPress={buttonPress.bind(this, status, setStatus)}
          style={{ backgroundColor: statusColors[status][1] }}
          //   isDisabled={status > 1}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  attendanceCard: {
    // alignItems: "center",
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
});

export default AttendanceCard;
