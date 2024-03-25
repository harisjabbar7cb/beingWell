import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const BookingScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const navigation = useNavigation();

    // Placeholder for marked dates
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        const fetchAvailableDates = async () => {
            const fetchedData = {
                '2024-03-20': { available: true, marked: true },

            };
            setMarkedDates(fetchedData);
        };
        fetchAvailableDates();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            const times = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00'];
            setAvailableTimes(times);
        }
    }, [selectedDate]);

    const renderTimeSlot = ({ item, index }) => (
        <TouchableOpacity
            style={[styles.timeSlot, item === selectedTime && styles.selectedTimeSlot]}
            onPress={() => setSelectedTime(item)}>
            <Text style={styles.timeText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Book an Appointment</Text>
            <Calendar
                // Calendar configuration...
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    setSelectedTime(null);
                }}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: { selected: true, marked: true },
                }}
            />
            <FlatList
                data={availableTimes}
                renderItem={renderTimeSlot}
                keyExtractor={(item, index) => index.toString()}
                numColumns={4}
                style={styles.timesGrid}
            />
            <TouchableOpacity
                style={[styles.button, { opacity: selectedTime ? 1 : 0.5 }]}
                onPress={() => selectedTime && navigation.navigate('BookingSuccess', { date: selectedDate, time: selectedTime })}
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
        backgroundColor: "#F5EEE6",
        alignItems: "center",
        justifyContent: "space-around",
    },
    title: {
        fontSize: 30,
        color: "#5264af",
        fontWeight: "bold",
    },
    timesGrid: {
        marginTop: 20,
        maxHeight: 200,
    },
    timeSlot: {
        backgroundColor: "#C3ACD0",
        borderRadius: 5,
        padding: 10,
        margin: 5,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTimeSlot: {
        backgroundColor: "#A084CA",
    },
    timeText: {
        color: "#FFF8E3",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#C3ACD0",
        padding: 15,
        borderRadius: 5,
        width: 200,
        alignItems: "center",
        marginTop: 20,

    },
    buttonText: {
        color: "#FFF8E3",
        fontSize: 18,
        textAlign: "center"
    },
});

export default BookingScreen;
