// DinasModal.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "./ui/Button";

export default function DinasModal({ isVisible, onDismiss, onSave }) {
  const [keterangan, setKeterangan] = useState("");
  const originalNavColor = useRef(null);
  const originalButtonStyle = useRef(null);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    async function makeTransparent() {
      // stash current values
      originalNavColor.current = await NavigationBar.getBackgroundColorAsync(); // :contentReference[oaicite:0]{index=0}
      originalButtonStyle.current = await NavigationBar.getButtonStyleAsync();

      // set transparent & light buttons
      await NavigationBar.setBackgroundColorAsync("transparent"); // :contentReference[oaicite:1]{index=1}
      await NavigationBar.setButtonStyleAsync("light");
    }

    async function restore() {
      // restore previous values (or choose a default)
      if (originalNavColor.current != null) {
        await NavigationBar.setBackgroundColorAsync(originalNavColor.current);
        await NavigationBar.setButtonStyleAsync(
          originalButtonStyle.current || "dark"
        );
      }
    }

    if (isVisible) {
      makeTransparent();
    } else {
      restore();
    }

    // also restore if the modal unmounts
    return () => {
      restore();
    };
  }, [isVisible]);

  const handleSimpan = () => {
    onSave(keterangan);
    setKeterangan("");
    onDismiss();
  };

  const handleBatal = () => {
    setKeterangan("");
    onDismiss();
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={handleBatal}
    >
      {/* make status bar translucent so our overlay shows through */}
      <StatusBar
        translucent
        backgroundColor="rgba(0,0,0,0.4)"
        barStyle="light-content"
      />

      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Keterangan Dinas</Text>
          <TouchableOpacity onPress={handleBatal} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Masukkan keterangan dinas"
          placeholderTextColor="#888"
          value={keterangan}
          onChangeText={setKeterangan}
          multiline
          textAlignVertical="top"
        />
        <View style={styles.actions}>
          <Button
            title="Batal"
            onPress={handleBatal}
            style={styles.cancelButton}
          />
          <Button
            title="Simpan"
            onPress={handleSimpan}
            style={styles.saveButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    position: "absolute",
    top: "30%",
    left: "5%",
    right: "5%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
});
