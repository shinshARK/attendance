import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TextInput } from "react-native";
import Card from "./Card";
import Button from "./Button";
import { AttendanceStatus, statusColors } from "../constants/attendance";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { performAttendanceCheck } from "../utils/backgroundAttendance";
import { BACKGROUND_FETCH_TASK } from "../utils/backgroundAttendance";
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "../store/attendanceSlice";
import IconButton from "./IconButton";
import CheckBox from "expo-checkbox";

const AttendanceCard = ({ name }) => {
  const dispatch = useDispatch();
  const { status, lastUpdated } = useSelector((state) => state.attendance);

  const [isCheckedDinas, setIsCheckedDinas] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [keteranganDinas, setKeteranganDinas] = useState("");

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

  const handleCheckboxDinasPress = () => {
    console.log(`att stat: ${status} checkbox state: ${isCheckedDinas}`);
    if (status === AttendanceStatus.CHECKING_IN) {
      if (!isCheckedDinas) {
        setIsModalVisible(true); // Open modal only when checking IN and checkbox is unchecked
      } else {
        setIsCheckedDinas(false); // Directly uncheck if already checked, no modal
        setKeteranganDinas(""); // Clear keterangan when unchecking
      }
    }
    // Do nothing if status is not CHECKING_IN (checkbox effectively disabled)
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

  const isCheckboxEnabled = status === AttendanceStatus.CHECKING_IN; // Control checkbox enabled state

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
      <View
        style={{
          // alignSelf: "flex-end",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
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
            disabled={!isCheckboxEnabled} // Disable checkbox based on status
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
        <Button
          title={buttonText}
          onPress={handleButtonPress}
          style={{ backgroundColor: statusColors[status][1] }}
          isDisabled={status > 1}
        />
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
