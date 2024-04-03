import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const JournalPage = () => {
    const navigation = useNavigation();
    const [text, setText] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const [currentDay, setCurrentDay] = useState('');
    const [dateString, setDateString] = useState('');
    const [historyVisible, setHistoryVisible] = useState(false);

    useEffect(() => {
        // Set the current day of the week and the date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const now = new Date();
        setCurrentDay(days[now.getDay()]);
        setDateString(now.toLocaleDateString());
    }, []);

    const backB = () => {
        navigation.goBack();
    };

    const submitB = () => {
        console.log('Text:', text);
        console.log('Selected Emoji:', selectedEmoji);
        console.log('Day:', currentDay);
        // Ideally, here you would also save the journal entry, selected emoji, day, and date to your state or backend for future retrieval.
        setText('');
        setSelectedEmoji('');
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
                            {['😊', '😐', '😢'].map(emoji => (
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
                    <Text style={styles.historyButtonText}>View History</Text>
                </TouchableOpacity>
            </ScrollView>
            <Modal animationType="slide" transparent={false} visible={historyVisible} onRequestClose={toggleHistory}>
                <View style={styles.historyModal}>
                    <TouchableOpacity onPress={toggleHistory} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    {/* Here you would render the history of journal entries and selected emojis */}
                    <Text style={styles.historyText}>Journal history will be displayed here...</Text>
                </View>
            </Modal>
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
        backgroundColor: '#E8EAF6', // A light shade that stands out against the background
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
    historyText: {
        color: '#5264af',
        fontSize: 18,
    },
});

export default JournalPage;
