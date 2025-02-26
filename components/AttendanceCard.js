import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TextInput, Alert } from "react-native";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { AttendanceStatus, statusColors } from "../constants/attendance";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import {
  performAttendanceCheck,
  syncNTPTime,
} from "../utils/backgroundAttendance";
import { BACKGROUND_FETCH_TASK } from "../utils/backgroundAttendance";
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "../store/attendanceSlice";
import IconButton from "./ui/IconButton";
import CheckBox from "expo-checkbox";
import { updateCurrentDayAttendanceStatus } from "../utils/firebase/db/attendanceApi";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store";
import * as Location from "expo-location";
import { haversine } from "../utils/location";

// uhh Ilkom Gedung C
// const OFFICE_LATITUDE = -6.872868773290025; // Replace with your office latitude
// const OFFICE_LONGITUDE = 107.59036591779108; // Replace with your office longitude

// ARM
const OFFICE_LATITUDE = -6.872868773290025; // Replace with your office latitude
const OFFICE_LONGITUDE = 107.59036591779108; // Replace with your office longitude

const OFFICE_RADIUS_METERS = 50; // 50 meters radius

const AttendanceCard = ({ name }) => {
  const dispatch = useDispatch();
  const { status: attendanceStatus, lastUpdated } = useSelector(
    (state) => state.attendance
  );

  const [isCheckedDinas, setIsCheckedDinas] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [keteranganDinas, setKeteranganDinas] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    async function registerBackgroundFetchAsync() {
      try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 5 * 60, // 5 minutes in seconds
          stopOnTerminate: false,
          startOnBoot: true,
        });
      } catch (error) {
        console.error("Error registering background fetch task:", error);
      }
    }
    async function effectFunction() {
      await registerBackgroundFetchAsync();
      await syncNTPTime();
    }
    effectFunction();
  }, [syncNTPTime]);

  const isLocationInOfficeRange = async () => {
    try {
      let { status: permissionStatus } =
        await Location.requestForegroundPermissionsAsync(); // Renamed status to permissionStatus
      if (permissionStatus !== "granted") {
        // Use permissionStatus here
        Alert.alert(
          "Location permission not granted",
          "Please grant location permission to check attendance."
        );
        return false;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(
        `current location coords: ${JSON.stringify(location.coords)}`
      );
      const distance = haversine(
        location.coords.latitude,
        location.coords.longitude,
        OFFICE_LATITUDE,
        OFFICE_LONGITUDE
      );

      console.log(`Distance to office: ${distance} meters`);
      return distance <= OFFICE_RADIUS_METERS;
    } catch (error) {
      console.error("Error checking location:", error);
      Alert.alert(
        "Location Error",
        "Could not get location. Please try again."
      );
      return false; // Assume not in range if location can't be determined
    }
  };

  const handleButtonPress = async () => {
    setButtonLoading(true);
    const isInOfficeRange = await isLocationInOfficeRange();
    if (!isInOfficeRange) {
      Alert.alert(
        "You are not in the office range",
        `Please check in/out when you are within ${OFFICE_RADIUS_METERS} meters of the office.`
      );
      setButtonLoading(false);
      return;
    }

    let newStatus;
    if (attendanceStatus === AttendanceStatus.CHECKING_IN) {
      newStatus = AttendanceStatus.CHECKED_IN;
    } else if (attendanceStatus === AttendanceStatus.CHECKING_OUT) {
      newStatus = AttendanceStatus.CHECKED_OUT;
    } else {
      setButtonLoading(false);
      return;
    }

    if (
      newStatus === AttendanceStatus.CHECKED_IN ||
      newStatus === AttendanceStatus.CHECKED_OUT
    ) {
      try {
        const userEmail = await AsyncStorage.getItem("email");
        await syncNTPTime();
        const syncedTime = store.getState().time.ntpTime;
        const today = new Date(syncedTime).toISOString().split("T")[0];

        let checkIn;
        if (AttendanceStatus.CHECKING_IN) {
        } else {
          checkIn = store.getState().attendance.checkInTime;
        }

        const attendanceData = {
          status: newStatus,
          isDinas: isCheckedDinas,
          dinasDescription: isCheckedDinas ? keteranganDinas : null,
          checkInTime:
            attendanceStatus === AttendanceStatus.CHECKING_IN
              ? new Date(syncedTime).toISOString()
              : store.getState().attendance.checkInTime,
          checkOutTime:
            attendanceStatus === AttendanceStatus.CHECKING_OUT
              ? new Date(syncedTime).toISOString()
              : null,
          lastUpdated: new Date(syncedTime).toISOString(),
        };

        if (userEmail) {
          await updateCurrentDayAttendanceStatus(today, attendanceData);
          dispatch(setStatus(attendanceData));
          console.log("Attendance data logged (manual button press).");
        } else {
          console.warn("User email not found, cannot log attendance.");
        }
        setButtonLoading(false);
      } catch (error) {
        setButtonLoading(false);
        console.error("Error logging attendance data on button press:", error);
      }
    }
  };

  const handleManualCheck = async () => {
    console.log("Manually triggering attendance recheck...");
    try {
      await performAttendanceCheck();
    } catch (error) {
      console.error("Error triggering manual check:", error);
    }
  };

  const handleCheckboxDinasPress = () => {
    if (attendanceStatus === AttendanceStatus.CHECKING_IN) {
      if (!isCheckedDinas) {
        setIsModalVisible(true);
      } else {
        setIsCheckedDinas(false);
        setKeteranganDinas("");
      }
    } // Do nothing if status is not CHECKING_IN (checkbox effectively disabled)
  };

  const handleSimpanKeterangan = () => {
    if (keteranganDinas.trim() !== "") {
      setIsCheckedDinas(true);
    } else {
      setIsCheckedDinas(false);
    }
    setIsModalVisible(false);
  };

  const handleBatalKeterangan = () => {
    setIsCheckedDinas(false);
    setIsModalVisible(false);
    setKeteranganDinas("");
  };

  let buttonText;
  if (buttonLoading) {
    buttonText = "Loading...";
  } else {
    switch (attendanceStatus) {
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
  }

  let content = "";
  let date = new Date(lastUpdated);

  if (
    attendanceStatus === AttendanceStatus.CHECKED_IN ||
    attendanceStatus === AttendanceStatus.CHECKING_OUT
  ) {
    content = `Checked in at: ${date}`;
  } else if (attendanceStatus === AttendanceStatus.CHECKED_OUT) {
    content = `Checked out at: ${date}`;
  }

  const isCheckboxEnabled = attendanceStatus === AttendanceStatus.CHECKING_IN;
  const showCheckbox = attendanceStatus !== AttendanceStatus.CHECKED_OUT;

  return (
    <Card
      style={styles.attendanceCard}
      gradientColors={statusColors[attendanceStatus] || ["#fff", "#fff"]}
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
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          flexGrow: 1,
          flexBasis: "100%",
        }}
      >
        {showCheckbox && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <CheckBox
              value={isCheckedDinas}
              onValueChange={handleCheckboxDinasPress}
              color={"white"}
              disabled={!isCheckboxEnabled}
            />
            <Text
              style={{
                color: "white",
                marginLeft: 5,
                opacity: isCheckboxEnabled ? 1 : 0.5,
              }}
            >
              Sedang Dinas
            </Text>
          </View>
        )}
        <View style={{ flex: 0, alignSelf: "flex-end" }}>
          <Button
            title={buttonText}
            onPress={handleButtonPress}
            style={{ backgroundColor: statusColors[attendanceStatus][1] }}
            isDisabled={attendanceStatus > 1}
          />
        </View>
      </View>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Keterangan Dinas:</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Masukkan keterangan dinas"
              value={keteranganDinas}
              onChangeText={setKeteranganDinas}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Simpan"
                onPress={handleSimpanKeterangan}
                style={styles.modalButton}
              />
              <Button
                title="Batal"
                onPress={handleBatalKeterangan}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalTextInput: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    minWidth: "40%",
  },
});

export default AttendanceCard;
