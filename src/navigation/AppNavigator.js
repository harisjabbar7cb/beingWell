import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import UserDashboard from "../screens/UserDashboard";
import HealthData from "../screens/HealthData";
import AdminDashboard from "../screens/AdminDashboard";
import bookingScreen from "../screens/bookingScreen";
import BookingSuccess from "../screens/BookingSuccess";

import mainMenu from "../screens/mainMenu";
import bmi from "../screens/bmi";
import journal from "../screens/journal";
import logout from "../screens/logout";
import forum from "../screens/forum";
import post from "../screens/post";
import meditation from "../screens/meditation";
import playMediation from "../screens/playMeditation";
import LearningModules from "../screens/learningModules";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="UserDashboard" component={UserDashboard} />
      <Stack.Screen name="HealthData" component={HealthData} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="bookingScreen" component={bookingScreen} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccess} />
      <Stack.Screen name="Menu" component={mainMenu} />
      <Stack.Screen name="bmi" component={bmi} />
      <Stack.Screen name="journal" component={journal} />
      <Stack.Screen name="logout" component={logout} />
      <Stack.Screen name="forum" component={forum} />
      <Stack.Screen name="post" component={post} />
      <Stack.Screen name="meditation" component={meditation} />
      <Stack.Screen name="playMeditation" component={playMediation} />
      <Stack.Screen name="learningModules" component={LearningModules} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
