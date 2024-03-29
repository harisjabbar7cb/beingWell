import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, deleteDoc, collection,query,where,getDocs,setDoc,getDoc,updateDoc} from 'firebase/firestore';
import { app } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


const db = getFirestore(app);

const BookingSuccessPage = ({ route }) => {
    const { date, time, bookingId } = route.params;
    const navigation = useNavigation();

    const cancelBooking = async () => {
        Alert.alert(
            "Cancel Booking",
            "Are you sure you want to cancel your booking?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancellation aborted"),
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: async () => {
                        try {
                            const uid = await AsyncStorage.getItem('userUID');
                            if (!uid) {
                                Alert.alert("Error", "User not identified.");
                                return;
                            }

                            // Attempt to find the specific time slot to mark it as available again
                            const timeSlotRef = doc(db, "available_dates", date, "times", time); // Assuming 'time' can be used as a doc ID

                            // Check if the time slot document exists
                            const docSnap = await getDoc(timeSlotRef);
                            if (!docSnap.exists()) {
                                // If it doesn't exist, create it and mark as available
                                await setDoc(timeSlotRef, { available: true });
                            } else {
                                // If it exists, just update it to available
                                await updateDoc(timeSlotRef, { available: true });
                            }

                            // Delete the appointment from the appointments collection
                            const q = query(collection(db, "appointments"), where("uid", "==", uid), where("date", "==", date), where("time", "==", time));
                            const querySnapshot = await getDocs(q);
                            querySnapshot.forEach(async (document) => {
                                await deleteDoc(doc(db, "appointments", document.id));
                            });

                            Alert.alert("Booking Cancelled", "Your booking has been successfully cancelled.", [
                                { text: "OK", onPress: () => navigation.goBack() } // or navigate to a specific screen as needed
                            ]);
                        } catch (error) {
                            console.error("Error cancelling booking:", error);
                            Alert.alert("Error", "Could not cancel the booking. Please try again.");
                        }
                    }
                }
            ],
            { cancelable: false }
        );
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
