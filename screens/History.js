import React from "react";
import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { AttendanceStatus } from "../constants/attendance";
import { setStatus, clearStatus } from "../store/attendanceSlice";

function History() {
  return (
    <View style={{ padding: 20 }}>
      <Text>History</Text>
    </View>
  );
}

export default History;
