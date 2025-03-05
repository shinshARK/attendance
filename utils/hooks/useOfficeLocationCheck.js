// utils/hooks/useOfficeLocationCheck.js
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { haversine } from "../location";
import { useSelector } from "react-redux";

const OFFICE_RADIUS_METERS = 50; // Moved constant outside component

const useOfficeLocationCheck = () => {
  const {
    alamat: OFFICE_ADDRESS,
    latitude: OFFICE_LATITUDE,
    longitude: OFFICE_LONGITUDE,
    nama_unit_kerja: OFFICE_NAME,
  } = useSelector((state) => state.unitKerja);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const isLocationInOfficeRange = async () => {
    setIsLocationLoading(true);
    try {
      let { status: permissionStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (permissionStatus !== "granted") {
        Alert.alert(
          "Location permission not granted",
          "Please grant location permission to check attendance."
        );
        return false;
      }

      let location = await Location.getCurrentPositionAsync({});
      const distance = haversine(
        location.coords.latitude,
        location.coords.longitude,
        OFFICE_LATITUDE,
        OFFICE_LONGITUDE
      );
      return distance <= OFFICE_RADIUS_METERS;
    } catch (error) {
      Alert.alert(
        "Location Error",
        "Could not get location. Please try again."
      );
      return false;
    } finally {
      setIsLocationLoading(false);
    }
  };

  return { isLocationInOfficeRange, isLocationLoading };
};

export default useOfficeLocationCheck;
