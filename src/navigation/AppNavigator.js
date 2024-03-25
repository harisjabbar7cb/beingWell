import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import UserDashboard from '../screens/UserDashboard';
import HealthData from '../screens/HealthData';
import AdminDashboard from '../screens/AdminDashboard';
import StepData from '../screens/StepData';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="UserDashboard" component={UserDashboard} />
            <Stack.Screen name="HealthData" component={HealthData} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="StepData" component={StepData} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
