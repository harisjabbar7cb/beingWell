import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import BookingScreen from './bookingScreen';
import HealthDataScreen from './HealthData';
import MainMenuScreen from './mainMenu';
import LoginScreen from './Login';



const Tab = createBottomTabNavigator();

const UserDashboardTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                switch (route.name) {
                    case 'Dashboard':
                        iconName = focused ? 'home' : 'home-outline';
                        break;
                    case 'Booking':
                        iconName = focused ? 'heart' : 'heart-outline';
                        break;
                    case 'HealthData':
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                        break;
                    case 'Login':
                        iconName = focused ? 'person' : 'person-outline';
                        break;
                    default:
                        iconName = 'alert-circle';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#C3ACD0',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { backgroundColor: '#F5EEE6' },
            headerShown: false,
        })}
    >
        <Tab.Screen name="Dashboard" component={MainMenuScreen} />
        <Tab.Screen name="Booking" component={BookingScreen} />
        <Tab.Screen name="HealthData" component={HealthDataScreen} />
        <Tab.Screen name="Login" component={LoginScreen} />
    </Tab.Navigator>
);




const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5EEE6',
    },
    text: {
        fontSize: 20,
        color: '#5264af',
    },
});

export default UserDashboardTabNavigator;
