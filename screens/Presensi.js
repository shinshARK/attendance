import { View, Text, ScrollView } from "react-native";
import Card from "../components/ui/Card";
import AttendanceCard from "../components/AttendanceCard";

function Presensi() {
  return (
    <View>
      <ScrollView>
        <AttendanceCard name={"Presensi"}></AttendanceCard>
      </ScrollView>
    </View>
  );
}

export default Presensi;
