// File: /screens/History.js
import React, { useEffect, useRef } from "react";
import { View, Text, Button, ActivityIndicator, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchAttendanceHistory } from "../store/historySlice";
import HistoryCard from "../components/HistoryCard";

import LottieView from "lottie-react-native";

function History() {
  const dispatch = useDispatch();
  const historyState = useSelector((state) => state.history);

  useEffect(() => {
    dispatch(fetchAttendanceHistory());
  }, [dispatch]);

  const renderItem = ({ item }) => (
    <HistoryCard
      date={item.date}
      checkInTime={item.checkInTime}
      checkOutTime={item.checkOutTime}
      status={item.status}
      dinasDescription={item.dinasDescription}
    />
  );

  const keyExtractor = (item, index) => index.toString(); // Simple key extractor

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20, textAlign: "center" }}>
        Attendance History
      </Text>

      {historyState.loading === "loading" && (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 20 }}
        />
      )}

      {historyState.error && (
        <Text style={{ color: "red", marginTop: 20, textAlign: "center" }}>
          Error: {historyState.error}
        </Text>
      )}

      {historyState.historyData && historyState.historyData.length > 0 ? (
        <FlatList // Replaced .map with FlatList
          data={historyState.historyData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      ) : historyState.loading !== "loading" && !historyState.error ? (
        <>
          <Text style={{ marginTop: 20, textAlign: "center" }}>
            No history data available.
          </Text>
          <LottieView
            source={require("../assets/animations/empty_history.json")}
            style={{ width: "100%", height: "70%" }}
            autoPlay
            loop={false}
          />
        </>
      ) : null}
    </View>
  );
}

export default History;
