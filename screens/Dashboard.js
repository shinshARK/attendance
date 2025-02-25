import React from "react";
import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { AttendanceStatus } from "../constants/attendance";
import { setStatus, clearStatus } from "../store/attendanceSlice";

function Dashboard() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Dashboard</Text>
    </View>
  );
}

export default Dashboard;
