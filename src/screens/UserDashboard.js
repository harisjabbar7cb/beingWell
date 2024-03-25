// UserDashboard.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const UserDashboard = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>User Dashboard</Text>
            <Button
                title="Go to Health Data"
                onPress={() => navigation.navigate('HealthData')}
            />
            <Button
                title="Go to Admin Dashboard"
                onPress={() => navigation.navigate('AdminDashboard')}
            />
            <Button
                title="Go to UserDashboard"
                onPress={() => navigation.navigate('AdminDashboard')}
            />
            <Button
                title="Go to login"
                onPress={() => navigation.navigate('Login')}
            />
            <Button
                title="Go to booking"
                onPress={() => navigation.navigate('bookingScreen')}
            />

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default UserDashboard;
