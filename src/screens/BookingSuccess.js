import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BookingSuccessPage = ({ route }) => {
    const { date, time } = route.params;
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Your Booking</Text>

            <Image style={styles.bookingImage}
                source={require('../image/booking.png')}
            />

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>Date: {date}</Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>Time: {time}</Text>
            </View>

            <TouchableOpacity
                style={styles.returnButton}
                onPress={() => navigation.navigate('UserDashboard')}
            >
                <Text style={styles.returnButtonText}>Return to Dashboard</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5EEE6',
    },
    headerText: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#5264af',
    },
    bookingImage: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    infoBox: {
        backgroundColor: '#C3ACD0',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 18,
        color: '#FFF8E3',
    },
    returnButton: {
        backgroundColor: '#A084CA',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    returnButtonText: {
        color: '#FFF8E3',
        fontSize: 18,
    },
});

export default BookingSuccessPage;
