import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LogoutScreen = () => {
    const navigation = useNavigation();

    const handleLogout = () => {
        navigation.navigate('Login'); // Navigate to the default screen after logout
    };

    return (
        <View style={styles.container}>
            <Text style={styles.seeYouSoonText}>See you soon!</Text>
            <Image
                source={require('../image/bye.png')} // Make sure the path to your image is correct
                style={styles.logoutImage}
            />
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
        justifyContent: 'center',
        paddingVertical: 20, // Added some padding to ensure there's space for the image
    },
    seeYouSoonText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#5264af',
        marginBottom: 20, // Adjust as necessary
    },
    logoutImage: {
        width: 300, // Adjust width as necessary
        height: 300, // Adjust height as necessary; ensure it's sufficient for the image
        marginBottom: 40, // Adjust as necessary

        top: 20
    },
    buttonContainer: {
        position: 'absolute',
        bottom: '10%', // Adjusted to ensure there's space for the image above
    },
    button: {
        backgroundColor: '#D9534F',
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
