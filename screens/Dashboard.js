import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { AttendanceStatus } from "../constants/attendance"; // Ensure this import is correct

function Dashboard() {
  const [storedStatus, setStoredStatus] = useState(null);

  // Fetch the stored status on component mount
  useEffect(() => {
    fetchStoredStatus();
  }, []);

  // Function to get and log the stored status
  const fetchStoredStatus = async () => {
    try {
      const value = await AsyncStorage.getItem("attendanceStatus");
      console.log("Retrieved attendanceStatus:", value);
      setStoredStatus(value ? parseInt(value) : null);
    } catch (error) {
      console.error("Error fetching attendanceStatus:", error);
    }
  };

  // Function to update the status
  const updateStatus = async (newStatus) => {
    try {
      await AsyncStorage.setItem("attendanceStatus", newStatus.toString());
      console.log("Updated attendanceStatus:", newStatus);
      setStoredStatus(newStatus);
    } catch (error) {
      console.error("Error updating attendanceStatus:", error);
    }
  };

  // Function to clear the stored status
  const clearStatus = async () => {
    try {
      await AsyncStorage.removeItem("attendanceStatus");
      console.log("Cleared attendanceStatus");
      setStoredStatus(null);
    } catch (error) {
      console.error("Error clearing attendanceStatus:", error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Dashboard</Text>
      <Text>
        Current attendanceStatus:{" "}
        {storedStatus !== null ? storedStatus : "None"}
      </Text>

      <Button title="Fetch Status" onPress={fetchStoredStatus} />
      <Button
        title="Set to CHECKING_IN"
        onPress={() => updateStatus(AttendanceStatus.CHECKING_IN)}
      />
      <Button
        title="Set to CHECKED_IN"
        onPress={() => updateStatus(AttendanceStatus.CHECKED_IN)}
      />
      <Button
        title="Set to CHECKING_OUT"
        onPress={() => updateStatus(AttendanceStatus.CHECKING_OUT)}
      />
      <Button
        title="Set to CHECKED_OUT"
        onPress={() => updateStatus(AttendanceStatus.CHECKED_OUT)}
      />
      <Button title="Clear Status" onPress={clearStatus} color="red" />
    </View>
  );
}

export default Dashboard;
