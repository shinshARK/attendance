import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Presensi from "./screens/Presensi";
import History from "./screens/History";
import Dashboard from "./screens/Dashboard";
import Debug from "./screens/Debug";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Provider, useDispatch, useSelector } from "react-redux";
import { resetAllStates, store } from "./store";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
// Remove WelcomeScreen import
// import WelcomeScreen from "./screens/WelcomeScreen";
import { Colors } from "./constants/styles";
import IconButton from "./components/ui/IconButton";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { logout as logoutAction, fetchStoredToken } from "./store/authSlice";
import { checkBiometricAvailability } from "./utils/biometricAuth";

const BottomTabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AttendanceBottomTabs() {
  const dispatch = useDispatch();
  const logoutHandler = useCallback(() => {
    dispatch(logoutAction()); // Then dispatch logoutAction
    dispatch(resetAllStates()); // Dispatch resetAllStates FIRST
  }, [dispatch]); // Added `navigation` to dependency array

  return (
    <BottomTabs.Navigator>
      <BottomTabs.Screen
        name="Presensi"
        component={Presensi}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-circle-outline" color={color} size={size} />
          ),
          headerRight: (
            { tintColor } // Add logout button to Presensi tab header
          ) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={logoutHandler}
            />
          ),
        }}
      />
      <BottomTabs.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" color={color} size={size} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Debug"
        component={Debug}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bug-outline" color={color} size={size} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
        headerShown: false, // Hide header for the entire AuthenticatedStack as tabs will have their own headers if needed
      }}
    >
      <Stack.Screen
        name="AttendanceTabs" // Directly render AttendanceBottomTabs
        component={AttendanceBottomTabs}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  console.log(`is authenticated? ${isAuthenticated}`);

  return (
    <NavigationContainer>
      {!isAuthenticated && <AuthStack />}
      {isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStoredToken()).then(() => {
      setIsTryingLogin(false);
    });
  }, [dispatch]);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <Root />
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
