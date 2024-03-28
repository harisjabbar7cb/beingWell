import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, deleteDoc, collection,query,where,getDocs} from 'firebase/firestore';
import { app } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


const db = getFirestore(app);

const BookingSuccessPage = ({ route }) => {
    const { date, time, bookingId } = route.params;
    const navigation = useNavigation();

    const cancelBooking = async () => {
        try {
            const uid = await AsyncStorage.getItem('userUID');
            if (!uid) {
                Alert.alert("Error", "User not identified.");
                return;
            }

            // Query for the booking document
            const bookingsRef = collection(db, "appointments");
            const q = query(bookingsRef, where("date", "==", date), where("time", "==", time), where("uid", "==", uid));

            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                Alert.alert("Not Found", "No matching booking found.");
                return;
            }


            querySnapshot.forEach(async (document) => {
                await deleteDoc(doc(db, "appointments", document.id));
            });

            Alert.alert("Booking Cancelled", "Your booking has been successfully cancelled.", [
                { text: "OK", onPress: () => navigation.navigate('UserDashboard', { screen: 'Dashboard' }) }
            ]);
        } catch (error) {
            console.error("Error cancelling booking:", error);
            Alert.alert("Error", "Could not cancel the booking. Please try again.");
        }
    };

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
                onPress={() => navigation.navigate('UserDashboard', {
                    screen: 'Dashboard',
                })}
            >
                <Text style={styles.returnButtonText}>Return to Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.returnButton, styles.cancelButton]}
                onPress={cancelBooking}
            >
                <Text style={styles.returnButtonText}>Cancel Booking</Text>
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
    cancelButton: {
        backgroundColor: '#D9534F',
        marginTop: 10,
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
