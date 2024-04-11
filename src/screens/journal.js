import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, Timestamp, orderBy } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '../firebaseConfig';

initializeApp(firebaseConfig);

const JournalPage = () => {
    const navigation = useNavigation();
    const [text, setText] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const [currentDay, setCurrentDay] = useState('');
    const [dateString, setDateString] = useState('');
    const [historyVisible, setHistoryVisible] = useState(false);
    const [journalEntries, setJournalEntries] = useState([]);

    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const now = new Date();
        setCurrentDay(days[now.getDay()]);
        setDateString(now.toLocaleDateString());
    }, []);

    useEffect(() => {
        const fetchJournalEntries = async () => {
            const userUID = await AsyncStorage.getItem('userUID');
            if (userUID) {
                const q = query(collection(db, 'journalEntries'), where('userId', '==', userUID), orderBy('date', 'desc'));
                const querySnapshot = await getDocs(q);
                const entries = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setJournalEntries(entries);
            } else {
                Alert.alert('Error', 'No user ID found. Please log in again.');
            }
        };

        fetchJournalEntries();
    }, []);
    const fetchJournalEntries = async () => {
        const userUID = await AsyncStorage.getItem('userUID');
        if (userUID) {
            const q = query(collection(db, 'journalEntries'), where('userId', '==', userUID), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const entries = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setJournalEntries(entries);
        } else {
            Alert.alert('Error', 'No user ID found. Please log in again.');
        }
    };

    const backB = () => {
        navigation.goBack();
    };

    const submitB = async () => {
        if (!auth.currentUser) {
            Alert.alert('You must be logged in to submit a journal entry.');
            return;
        }
        if (text.trim() === '' || selectedEmoji === '') {
            Alert.alert('Please fill in all fields.');
            return;
        }
        const entry = {
            text: text,
            emoji: selectedEmoji,
            day: currentDay,
            date: Timestamp.fromDate(new Date()),
            userId: auth.currentUser.uid,
        };
        try {
            await addDoc(collection(db, 'journalEntries'), entry);
            setText('');
            setSelectedEmoji('');
            fetchJournalEntries();
            Alert.alert('Success', 'Your journal entry has been successfully submitted!');
        } catch (error) {
            console.error('Error adding document: ', error);
            Alert.alert('Error', 'Error submitting journal entry.');
        }
    };

    const toggleHistory = () => {
        setHistoryVisible(!historyVisible);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={backB} style={styles.backButton}>
                <Image source={require('../image/back.png')} style={styles.backImage} />
            </TouchableOpacity>
            <Text style={styles.header}>Journal Page</Text>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.journalContainer}>
                    <View style={styles.dateEmojiContainer}>
                        <Text style={styles.dayText}>{`${currentDay}, ${dateString}`}</Text>
                        <View style={styles.emojiContainer}>
                            {['😊', '😐', '😢'].map((emoji) => (
                                <TouchableOpacity
                                    key={emoji}
                                    style={[styles.emoji, selectedEmoji === emoji && styles.selectedEmoji]}
                                    onPress={() => setSelectedEmoji(emoji)}
                                >
                                    <Text style={styles.emojiText}>{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <TextInput
                            style={styles.textArea}
                            multiline={true}
                            placeholder="Write your thoughts here..."
                            onChangeText={setText}
                            value={text}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={submitB} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleHistory} style={styles.historyButton}>
                    <Text style={styles.historyButtonText}>{historyVisible ? 'Hide History' : 'View History'}</Text>
                </TouchableOpacity>
                {historyVisible && (
                    <View style={styles.historyContainer}>
                        {journalEntries.map((entry) => (
                            <View key={entry.id} style={styles.entryContainer}>
                                <Text style={styles.entryDay}>{entry.day}, {entry.date.toDate().toLocaleDateString()}</Text>
                                <View style={styles.emojiContainer}>
                                    {['😊', '😐', '😢'].map((emoji) => (
                                        <Text key={emoji} style={[styles.emoji, entry.emoji === emoji && styles.selectedEmoji]}>
                                            {emoji}
                                        </Text>
                                    ))}
                                </View>
                                <Text style={styles.entryText}>{entry.text}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5EEE6',
        alignItems: 'center',
        paddingTop: 60,
    },
    scrollContainer: {
        width: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 10,
        zIndex: 10,
    },
    backImage: {
        width: 50,
        height: 50,
    },
    header: {
        fontSize: 30,
        color: '#5264af',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    journalContainer: {
        backgroundColor: '#E8EAF6',
        borderRadius: 20,
        padding: 15,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 20,
    },
    dateEmojiContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    dayText: {
        fontSize: 18,
        color: '#5264af',
        marginBottom: 10,
    },
    emojiContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emoji: {
        marginHorizontal: 10,
        padding: 5,
    },
    emojiText: {
        fontSize: 24,
    },
    selectedEmoji: {
        backgroundColor: '#5264af',
        borderRadius: 5,
    },
    textContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        minHeight: 150,
        justifyContent: 'center',
    },
    textArea: {
        fontSize: 16,
        margin: 10,
    },
    submitButton: {
        backgroundColor: '#5264af',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginVertical: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    historyButton: {
        backgroundColor: '#6ECB63',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'center',
    },
    historyButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    historyModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5EEE6',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 10,
        padding: 10,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#5264af',
    },
    historyScrollView: {
        width: '100%',
    },
    entryContainer: {
        backgroundColor: '#E8EAF6',
        borderRadius: 20,
        padding: 15,
        top:10,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 20,
    },
    entryDay: {
        fontSize: 18,
        color: '#5264af',
        marginBottom: 10,
        textAlign: 'center',
    },
    entryText: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default JournalPage;
