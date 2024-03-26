import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList,Alert} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, doc, getDocs, setDoc} from 'firebase/firestore';
import { app } from '../firebaseConfig'; // Make sure this path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';
const db = getFirestore(app);

const BookingScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [markedDates, setMarkedDates] = useState({});
    const navigation = useNavigation();

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

                // Mark dates without available times as disabled
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
            try {
                const dateDocRef = doc(db, 'available_dates', selectedDate);
                const timesCollectionRef = collection(dateDocRef, 'times');
                const snapshot = await getDocs(timesCollectionRef);

                const times = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setAvailableTimes(times.filter(time => time.available));
                setSelectedTime('');
            } catch (error) {
                console.error('Error fetching available times:', error);
            }
        };

        fetchAvailableTimes();
    }, [selectedDate]);
    const bookAppointment = async () => {
        try {
            const uid = await AsyncStorage.getItem('userUID');
            // Optional: Fetch the user's name if needed
            // const userName = await AsyncStorage.getItem('userName');

            if (!uid) {
                Alert.alert("Error", "User not identified.");
                return;
            }

            const appointmentDetails = {
                date: selectedDate,
                time: selectedTime,
                uid: uid,
                // userName: userName, // Uncomment if using userName
            };

            // Create a new appointment document in 'appointments' collection
            const newAppointmentRef = doc(collection(db, 'appointments'));
            await setDoc(newAppointmentRef, appointmentDetails);

            Alert.alert("Success", "Your appointment has been booked.");
            navigation.navigate('BookingSuccess', { date: selectedDate, time: selectedTime }); // Navigate or update state as needed
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
                }}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: { ...markedDates[selectedDate], selected: true },
                }}
            />
            <FlatList
                data={availableTimes}
                renderItem={renderTimeSlot}
                keyExtractor={(item) => item.id}
                numColumns={4}
                style={styles.timesGrid}
            />
            <TouchableOpacity
                style={[styles.button, { opacity: selectedTime ? 1 : 0.5 }]}
                onPress={() => {
                    if (selectedTime) {
                        navigation.navigate('BookingSuccess', { date: selectedDate, time: selectedTime }), bookAppointment();
                    }
                }}
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
        backgroundColor: '#A084CA',
    },
    timeText: {
        color: '#FFF8E3',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#C3ACD0',
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
});

export default BookingScreen;
