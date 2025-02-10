import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Presensi from "./screens/Presensi";
import Dashboard from "./screens/Dashboard";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const BottomTabs = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabs.Navigator>
        <BottomTabs.Screen
          name="Presensi"
          component={Presensi}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="people-circle-outline"
                color={color}
                size={size}
              ></Ionicons>
            ),
          }}
        ></BottomTabs.Screen>
        <BottomTabs.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="space-dashboard" color={color} size={size} />
            ),
          }}
        ></BottomTabs.Screen>
      </BottomTabs.Navigator>
    </NavigationContainer>
  );
}
