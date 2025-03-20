import { View, Text, StyleSheet, Modal, TextInput } from "react-native";
import Button from "./ui/Button";
import { useState } from "react";

const DinasModal = ({ isVisible, onDismiss, onSave }) => {
  const [keterangan, setKeterangan] = useState("");

  const handleSimpan = () => {
    onSave(keterangan); // Call the onSave callback with the keterangan
    setKeterangan(""); // Clear the input after saving
  };

  const handleBatal = () => {
    onDismiss(); // Call the onDismiss callback
    setKeterangan(""); // Clear the input
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Keterangan Dinas:</Text>
          <TextInput
            style={styles.modalTextInput}
            placeholder="Masukkan keterangan dinas"
            value={keterangan}
            onChangeText={setKeterangan}
            multiline
            numberOfLines={4}
          />
          <View style={styles.modalButtons}>
            <Button
              title="Simpan"
              onPress={handleSimpan}
              style={styles.modalButton}
            />
            <Button
              title="Batal"
              onPress={handleBatal}
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default DinasModal;
