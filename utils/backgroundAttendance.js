import NTPSync from "@ruanitto/react-native-ntp-sync";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AttendanceStatus } from "../constants/attendance";

const BACKGROUND_FETCH_TASK = "attendance-background-fetch";

// Function to perform attendance check (can be called manually)
export const performAttendanceCheck = async () => {
  try {
    const ntp = new NTPSync({
      servers: [
        { server: "id.pool.ntp.org", port: 123 },
        { server: "sg.pool.ntp.org", port: 123 },
      ],
      syncInterval: 300000, // 5 minutes in milliseconds
      syncOnCreation: true,
      autoSync: true,
    });

    await ntp.syncTime();
    const syncedTime = ntp.getTime();
    const now = new Date(syncedTime);
    const hour = now.getHours();

    console.log(`Fetched NTP Time: ${syncedTime} `);
    console.log(`Current Local Hour: ${hour}`);

    let currentStoredStatus = await AsyncStorage.getItem("attendanceStatus");
    console.log(`Fetched AsyncStorage: ${currentStoredStatus}`);
    if (currentStoredStatus) {
      currentStoredStatus = parseInt(currentStoredStatus);
    }

    let newStatus;

    // if (hour < 8 || !currentStoredStatus) {
    //   newStatus = AttendanceStatus.CHECKING_IN;
    // } else {
    //   if (currentStoredStatus === AttendanceStatus.CHECKING_IN) {
    //     newStatus = AttendanceStatus.CHECKING_IN;
    //   } else {
    //     if (hour >= 12 && hour < 17) {
    //       newStatus = AttendanceStatus.CHECKED_IN;
    //     } else if (hour >= 17 && hour < 20) {
    //       newStatus = AttendanceStatus.CHECKING_OUT;
    //     } else {
    //       newStatus = AttendanceStatus.CHECKED_OUT;
    //     }
    //   }
    // }

    if (
      hour < 8 ||
      !currentStoredStatus ||
      currentStoredStatus === AttendanceStatus.CHECKING_IN
    ) {
      newStatus = AttendanceStatus.CHECKING_IN;
    } else if (
      currentStoredStatus === AttendanceStatus.CHECKED_IN &&
      hour >= 14 &&
      hour < 20
    ) {
      newStatus = AttendanceStatus.CHECKING_OUT;
    } else {
      newStatus = currentStoredStatus;
    }

    if (newStatus !== currentStoredStatus) {
      await AsyncStorage.setItem("attendanceStatus", newStatus.toString());
      console.log(
        `[Manual/Background] Updated attendance status to ${newStatus} at ${now.toISOString()}`
      );
    } else {
      console.log(
        `[Manual/Background] No change: attendance status remains ${currentStoredStatus} at ${now.toISOString()}`
      );
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error("[Manual/Background] Error updating attendance status:", err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
};

// Register background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  return await performAttendanceCheck(); // Reuse the function
});

export { BACKGROUND_FETCH_TASK };
