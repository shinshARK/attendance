import React from "react";
import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { AttendanceStatus } from "../constants/attendance";
import { setStatus, clearStatus } from "../store/attendanceSlice";
import HistoryCard from "../components/HistoryCard";

function History() {
  const historyData = [
    {
      date: "2024-02-25T00:00:00.000Z", // Example date in ISO format
      checkInTime: "2024-02-25T08:00:00.000Z",
      checkOutTime: "2024-02-25T17:00:00.000Z",
      status: 3, // Example status (Checked Out)
      dinasDescription: null,
    },
    {
      date: "2024-02-24T00:00:00.000Z",
      checkInTime: "2024-02-24T09:00:00.000Z",
      checkOutTime: "2024-02-24T18:00:00.000Z",
      status: 3,
      dinasDescription: "Dinas Luar Kota",
    },
    // ... more history data
  ];

  return (
    <View style={{ padding: 20 }}>
      {/* <Text>History</Text> */}
      {historyData.map((item, index) => (
        <HistoryCard
          key={index}
          date={item.date}
          checkInTime={item.checkInTime}
          checkOutTime={item.checkOutTime}
          status={item.status}
          dinasDescription={item.dinasDescription}
        />
      ))}
    </View>
  );
}

export default History;
