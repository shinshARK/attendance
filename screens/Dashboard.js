import React from "react";
import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { AttendanceStatus } from "../constants/attendance";
import { setStatus, clearStatus } from "../store/attendanceSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const { status, checkInTime, checkOutTime } = useSelector(
    (state) => state.attendance
  );

  return (
    <View style={{ padding: 20 }}>
      <Text>Dashboard</Text>
      <Text>Current attendanceStatus: {status !== null ? status : "None"}</Text>
      <Text>Checkin time: {checkInTime !== null ? checkInTime : "None"}</Text>
      <Text>
        Checkout time: {checkOutTime !== null ? checkOutTime : "None"}
      </Text>

      <Button
        title="Set to CHECKING_IN"
        onPress={() =>
          dispatch(setStatus({ status: AttendanceStatus.CHECKING_IN }))
        }
      />
      <Button
        title="Set to CHECKED_IN"
        onPress={() =>
          dispatch(setStatus({ status: AttendanceStatus.CHECKED_IN }))
        }
      />
      <Button
        title="Set to CHECKING_OUT"
        onPress={() =>
          dispatch(setStatus({ status: AttendanceStatus.CHECKING_OUT }))
        }
      />
      <Button
        title="Set to CHECKED_OUT"
        onPress={() =>
          dispatch(setStatus({ status: AttendanceStatus.CHECKED_OUT }))
        }
      />
    </View>
  );
}

export default Dashboard;
