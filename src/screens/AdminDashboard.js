// HealthData.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HealthData = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Admin Dashboard</Text>
            <Button
                title="Back to Dashboard"
                onPress={() => navigation.navigate('UserDashboard')}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default HealthData;
