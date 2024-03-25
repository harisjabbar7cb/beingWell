import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import UserDashboard from '../screens/UserDashboard';
import HealthData from '../screens/HealthData';
import AdminDashboard from '../screens/AdminDashboard';
import bookingScreen from '../screens/bookingScreen';
import BookingSuccess from '../screens/BookingSuccess';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="UserDashboard" component={UserDashboard} />
            <Stack.Screen name="HealthData" component={HealthData} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="bookingScreen" component={bookingScreen}/>
            <Stack.Screen name="BookingSuccess" component={BookingSuccess}/>
        </Stack.Navigator>
    );
};

export default AppNavigator;
