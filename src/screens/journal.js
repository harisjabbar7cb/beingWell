import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const JournalPage = () => {
    const navigation = useNavigation();
    const [text, setText] = useState('');
    const [selectedEmojis, setEmoji] = useState({});

    const backB = () => {
        navigation.goBack();
    };

    const selectDay = (day) => {
        setEmoji(prevState => ({
            ...prevState,
            [day]: prevState[day] || '😊', 
        }));
    };

    const selectEmoji = (day, emoji) => {
        setEmoji(prevState => ({
            ...prevState,
            [day]: emoji,
        }));
    };
    const submitB = () => {
        
        console.log('Text:', text);
        console.log('Selected Emojis:', selectedEmojis);
        
        setText('');
        setEmoji({});
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={backB}
                style={styles.backButton}
            >
                <Image
                    source={require('../image/back.png')}
                    style={styles.backImage}
                />
            </TouchableOpacity>
            <Text style={styles.header}>
                Journal Page
            </Text>
            <View style={styles.textContainer}>
                <TextInput
                    style={styles.textArea}
                    multiline={true}
                    placeholder="Write your thoughts here..."
                    onChangeText={setText}
                    value={text}
                />
            </View>
            <TouchableOpacity onPress={submitB} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <View style={styles.daysContainer}>
                {['Monday'].map(day => (
                    <TouchableOpacity
                        key={day}
                        style={[styles.dayButton, selectedEmojis[day] && styles.selectedDayButton]}
                        onPress={() => selectDay(day)}
                    >
                        <Text style={styles.dayText}>{day}</Text>
                        <View style={styles.emojiContainer}>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😊' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😊')}
                            >
                                <Text>😊</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😐' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😐')}
                            >
                                <Text>😐</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😢' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😢')}
                            >
                                <Text>😢</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.daysContainer}>
                {['Tuesday'].map(day => (
                    <TouchableOpacity
                        key={day}
                        style={[styles.dayButton, selectedEmojis[day] && styles.selectedDayButton]}
                        onPress={() => selectDay(day)}
                    >
                        <Text style={styles.dayText}>{day}</Text>
                        <View style={styles.emojiContainer}>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😊' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😊')}
                            >
                                <Text>😊</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😐' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😐')}
                            >
                                <Text>😐</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😢' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😢')}
                            >
                                <Text>😢</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </TouchableOpacity>
                ))}
            </View>
            
            <View style={styles.daysContainer}>
                {['Wednesday'].map(day => (
                    <TouchableOpacity
                        key={day}
                        style={[styles.dayButton, selectedEmojis[day] && styles.selectedDayButton]}
                        onPress={() => selectDay(day)}
                    >
                        <Text style={styles.dayText}>{day}</Text>
                        <View style={styles.emojiContainer}>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😊' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😊')}
                            >
                                <Text>😊</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😐' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😐')}
                            >
                                <Text>😐</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😢' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😢')}
                            >
                                <Text>😢</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.daysContainer}>
                {['Thursday'].map(day => (
                    <TouchableOpacity
                        key={day}
                        style={[styles.dayButton, selectedEmojis[day] && styles.selectedDayButton]}
                        onPress={() => selectDay(day)}
                    >
                        <Text style={styles.dayText}>{day}</Text>
                        <View style={styles.emojiContainer}>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😊' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😊')}
                            >
                                <Text>😊</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😐' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😐')}
                            >
                                <Text>😐</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😢' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😢')}
                            >
                                <Text>😢</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.daysContainer}>
                {['Friday'].map(day => (
                    <TouchableOpacity
                        key={day}
                        style={[styles.dayButton, selectedEmojis[day] && styles.selectedDayButton]}
                        onPress={() => selectDay(day)}
                    >
                        <Text style={styles.dayText}>{day}</Text>
                        <View style={styles.emojiContainer}>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😊' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😊')}
                            >
                                <Text>😊</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😐' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😐')}
                            >
                                <Text>😐</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😢' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😢')}
                            >
                                <Text>😢</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.daysContainer}>
                {['Saturday'].map(day => (
                    <TouchableOpacity
                        key={day}
                        style={[styles.dayButton, selectedEmojis[day] && styles.selectedDayButton]}
                        onPress={() => selectDay(day)}
                    >
                        <Text style={styles.dayText}>{day}</Text>
                        <View style={styles.emojiContainer}>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😊' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😊')}
                            >
                                <Text>😊</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😐' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😐')}
                            >
                                <Text>😐</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😢' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😢')}
                            >
                                <Text>😢</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.daysContainer}>
                {['Sunday'].map(day => (
                    <TouchableOpacity
                        key={day}
                        style={[styles.dayButton, selectedEmojis[day] && styles.selectedDayButton]}
                        onPress={() => selectDay(day)}
                    >
                        <Text style={styles.dayText}>{day}</Text>
                        <View style={styles.emojiContainer}>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😊' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😊')}
                            >
                                <Text>😊</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😐' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😐')}
                            >
                                <Text>😐</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emoji, selectedEmojis[day] === '😢' && styles.selectedEmoji]}
                                onPress={() => selectEmoji(day, '😢')}
                            >
                                <Text>😢</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
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
    textContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        width: '90%',
        marginBottom: 20,
        minHeight: 150,
        justifyContent: 'center',
    },
    textArea: {
        fontSize: 16,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
    },
    dayButton: {
        alignItems: 'center',
    },
    dayText: {
        fontSize: 18,
        marginBottom: 5,
    },
    emojiContainer: {
        flexDirection: 'row',
    },
    emoji: {
        fontSize: 20,
        marginRight: 5,
    },
    selectedEmoji: {
        backgroundColor: '#5264af',
        borderRadius: 5,
        padding: 5,
    },
    selectedDayButton: {
        backgroundColor: '#f0f0f0',
    },
    submitButton: {
        backgroundColor: '#5264af',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default JournalPage;
