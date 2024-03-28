import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LogoutScreen = () => {
    const navigation = useNavigation();

    const handleLogout = () => {
        navigation.navigate('Login'); // Navigate to the default screen after logout
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5EEE6',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: '25%',
    },
    button: {
        backgroundColor: 'red',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LogoutScreen;
