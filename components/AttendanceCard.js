import { View, Text, StyleSheet } from "react-native";
import Card from "./Card";
import Button from "./Button";
import { useState } from "react";
import { AttendanceStatus, statusColors } from "../constants/attendance";

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
