import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getFirestore, collection, doc, getDocs, setDoc, query, where, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '../firebaseConfig';
const db = getFirestore(app);

const BookingScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [markedDates, setMarkedDates] = useState({});
    const navigation = useNavigation();
    const [showInstructions, setShowInstructions] = useState(true);

    useEffect(() => {


        const fetchDatesAndTimes = async () => {
            const datesCollectionRef = collection(db, 'available_dates');
            const datesSnapshot = await getDocs(datesCollectionRef);
            const newMarkedDates = {};
            for (const doc of datesSnapshot.docs) {
                const date = doc.id;
                const timesCollectionRef = collection(doc.ref, 'times');
                const timesSnapshot = await getDocs(timesCollectionRef);
                const times = timesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const hasAvailableTimes = times.some(time => time.available);
                newMarkedDates[date] = {
                    disabled: !hasAvailableTimes,
                    disableTouchEvent: !hasAvailableTimes,
                    marked: hasAvailableTimes,
                    selectedColor: hasAvailableTimes ? 'blue' : 'gray',
                };
            }
            setMarkedDates(newMarkedDates);
        };
        fetchDatesAndTimes();
    }, []);

    useEffect(() => {
        if (!selectedDate) return;
        const fetchAvailableTimes = async () => {
            const dateDocRef = doc(db, 'available_dates', selectedDate);
            const timesCollectionRef = collection(dateDocRef, 'times');
            const snapshot = await getDocs(timesCollectionRef);
            const times = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAvailableTimes(times.filter(time => time.available));
            setSelectedTime('');
        };
        fetchAvailableTimes();
    }, [selectedDate]);

    useFocusEffect(
        useCallback(() => {
            const checkExistingAppointment = async () => {
                const uid = await AsyncStorage.getItem('userUID');
                if (uid) {
                    const q = query(collection(db, "appointments"), where("uid", "==", uid));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const appointment = querySnapshot.docs[0].data();
                        navigation.navigate('BookingSuccess', { date: appointment.date, time: appointment.time });
                        return; // Stop execution if an appointment is found
                    }
                }
            };
            checkExistingAppointment();
        }, [navigation])
    );


    const bookAppointment = async () => {
        try {
            const uid = await AsyncStorage.getItem('userUID');
            if (!uid) {
                Alert.alert("Error", "User not identified.");
                return;
            }
            const appointmentDetails = {
                date: selectedDate,
                time: selectedTime,
                uid: uid,
            };
            const newAppointmentRef = doc(collection(db, 'appointments'));
            await setDoc(newAppointmentRef, appointmentDetails);
            const timeSlotRef = doc(db, 'available_dates', selectedDate, 'times', selectedTime);
            await updateDoc(timeSlotRef, { available: false });
            Alert.alert("Success", "Your appointment has been booked.");
            navigation.navigate('BookingSuccess', { date: selectedDate, time: selectedTime });
        } catch (error) {
            console.error('Error booking the appointment:', error);
            Alert.alert("Error", "Could not book the appointment. Please try again.");
        }
    };


    const renderTimeSlot = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.timeSlot,
                item.id === selectedTime ? styles.selectedTimeSlot : {},
            ]}
            onPress={() => setSelectedTime(item.id)}
            disabled={!item.available}
        >
            <Text style={styles.timeText}>{item.id}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Book an Appointment</Text>
            <Calendar
                onDayPress={(day) => {
                    if (markedDates[day.dateString]?.disabled) {
                        console.log('No available times for this date');
                        return;
                    }
                    setSelectedDate(day.dateString);
                    setShowInstructions(false);
                }}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: { ...markedDates[selectedDate], selected: true },
                }}
            />
            {showInstructions && (
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructions}>
                        Select a date to book an appointment with one of our 20 trained health ambassadors.
                        You will receive an email confirmation with a Microsoft Teams meeting link once booked.
                    </Text>
                </View>
            )}
            {!showInstructions && (
                <FlatList
                    data={availableTimes}
                    renderItem={renderTimeSlot}
                    keyExtractor={(item) => item.id}
                    numColumns={4}
                    style={styles.timesGrid}
                />
            )}
            <TouchableOpacity
                style={[styles.button, { opacity: selectedTime ? 1 : 0.5 }]}
                onPress={bookAppointment}
                disabled={!selectedTime}
            >
                <Text style={styles.buttonText}>Confirm Appointment</Text>
            </TouchableOpacity>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5EEE6',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    title: {
        fontSize: 30,
        color: '#5264af',
        fontWeight: 'bold',
        paddingTop: 10,
    },
    timesGrid: {
        marginTop: 20,
        maxHeight: 200,
    },
    timeSlot: {
        backgroundColor: '#C3ACD0',
        borderRadius: 5,
        padding: 10,
        margin: 5,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unavailableTimeSlot: {
        backgroundColor: '#CCCCCC',
    },
    selectedTimeSlot: {
        backgroundColor: '#a16dbe',
    },
    timeText: {
        color: '#FFF8E3',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#a16dbe',
        padding: 15,
        borderRadius: 5,
        width: 200,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF8E3',
        fontSize: 18,
        textAlign: 'center',
    },
    instructionsContainer: {
        marginTop: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    instructions: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
    },
});

export default BookingScreen;
