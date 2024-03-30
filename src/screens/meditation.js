import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Alert, Dimensions, ScrollView } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const sidePadding = 20;
const contentWidth = screenWidth - (sidePadding * 2);

initializeApp(firebaseConfig);

const db = getFirestore();

const speakers = [
    {
        label: "No Speaker",
        value: "none",
        description: "Find tranquility and focus with a guided session focused purely on ambiance.",
    },
    {
        label: "Alan Watts",
        value: "alanWatts",
        description: "Experience profound insights with Alan Watts, bringing Eastern philosophy to Western audiences.",
    },
    {
        label: "Mooji",
        value: "mooji",
        description: "Dive deep into the essence of being with Mooji's gentle approach to self-inquiry.",
    },
];

const ambienceOptions = [
    { label: "Nature", value: "nature", image: require('../image/nature.jpg'), color: '#A5D6A7' },
    { label: "City", value: "city", image: require('../image/city.jpg'), color: '#90CAF9' },
    { label: "Night", value: "night", image: require('../image/night.jpg'), color: '#B39DDB' },
    { label: "Binaural Beats", value: "binauralBeats", image: require('../image/wave.jpg'), color: '#80CBC4' },
    { label: "Lofi Hip Hop", value: "lofiHipHop", image: require('../image/lofi.jpg'), color: '#BCAAA4' },
];

const timeOptions = [5, 10, 15];

const MeditationCreator = () => {
    const [creatingNewMeditation, setCreatingNewMeditation] = useState(false);
    const [selectedSpeaker, setSelectedSpeaker] = useState(null);
    const [selectedAmbience, setSelectedAmbience] = useState(null);
    const [selectedTime, setSelectedTime] = useState(timeOptions[0]);
    const [savedMeditations, setSavedMeditations] = useState([]);
    const scrollViewRef = useRef();
    const navigation = useNavigation();

    useEffect(() => {
        fetchSavedMeditations();
    }, []);

    const fetchSavedMeditations = async () => {
        const uid = await AsyncStorage.getItem('userUID');
        if (!uid) {
            Alert.alert("Error", "User not identified.");
            return;
        }

        const q = query(collection(db, "meditations"), where("userUID", "==", uid));
        const querySnapshot = await getDocs(q);
        const meditations = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setSavedMeditations(meditations);
    };

    const getDisplayName = (name) => {
        switch (name) {
            case 'alanWatts':
                return 'Alan Watts';
            case 'binauralBeats':
                return 'Binaural Beats';
            case 'lofiHipHop':
                return 'Lofi Hip Hop';
            default:
                return name.charAt(0).toUpperCase() + name.slice(1);
        }
    };

    const handleCreateMeditation = async () => {
        if (!selectedSpeaker || !selectedAmbience || !selectedTime) {
            Alert.alert("Error", "Please make sure all options are selected.");
            return;
        }

        if (savedMeditations.length >= 3) {
            Alert.alert("Limit Reached", "You can only have up to 3 custom meditations. Please delete a meditation to create a new one.");
            return;
        }

        const uid = await AsyncStorage.getItem('userUID');
        if (!uid) {
            Alert.alert("Error", "User not identified.");
            return;
        }

        try {
            await addDoc(collection(db, "meditations"), {
                speaker: selectedSpeaker,
                ambience: selectedAmbience,
                time: selectedTime,
                userUID: uid,
            });
            Alert.alert("Success", "Meditation saved successfully.");
            fetchSavedMeditations();
            setCreatingNewMeditation(false);
        } catch (error) {
            console.error("Error saving meditation: ", error);
            Alert.alert("Error", "There was a problem saving your meditation.");
        }
    };

    const handleDeleteMeditation = async (meditationId) => {
        try {
            await deleteDoc(doc(db, "meditations", meditationId));
            fetchSavedMeditations();
        } catch (error) {
            console.error("Error deleting meditation: ", error);
            Alert.alert("Error", "There was a problem deleting the meditation.");
        }
    };

    const handleBackToDashboard = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleBackToDashboard}>
                    <Image source={require('../image/back.png')} style={styles.backImage} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={[{ key: 'header' }]}
                renderItem={({ item }) => (
                    <View style={styles.content}>
                        <Text style={styles.header}>My Meditations</Text>
                        <FlatList
                            data={savedMeditations}
                            renderItem={({ item }) => {
                                const ambienceItem = ambienceOptions.find(option => option.value === item.ambience);
                                const backgroundColor = ambienceItem ? ambienceItem.color : '#FFF';

                                return (
                                    <View style={[styles.savedMeditationItem, { backgroundColor }]}>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => handleDeleteMeditation(item.id)}
                                        >
                                            <Text style={styles.deleteButtonText}>×</Text>
                                        </TouchableOpacity>
                                        <View style={styles.meditationDetails}>
                                            <View style={styles.meditationContent}>
                                                <Text style={styles.meditationText}>Speaker: {getDisplayName(item.speaker)}</Text>
                                                <Text style={styles.meditationText}>Ambience: {getDisplayName(item.ambience)}</Text>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.playButton}
                                                onPress={() => navigation.navigate('playMeditation', {
                                                    ambience: item.ambience,
                                                    speaker: item.speaker,
                                                    time: item.time,
                                                })}
                                            >
                                                <Image source={require('../image/play.png')} style={styles.playIcon} />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.meditationTime}>{item.time} min</Text>
                                    </View>
                                );
                            }}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={styles.meditationSeparator} />}
                        />
                        <TouchableOpacity
                            style={[styles.createButton, creatingNewMeditation && styles.cancelButton]}
                            onPress={() => setCreatingNewMeditation(!creatingNewMeditation)}
                        >
                            <Text style={styles.createButtonText}>{creatingNewMeditation ? "Cancel" : "Create a New Meditation"}</Text>
                        </TouchableOpacity>

                        {creatingNewMeditation && (
                            <>
                                <Text style={styles.subHeader}>Select a Speaker:</Text>
                                {speakers.map((speaker, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.option, selectedSpeaker === speaker.value && styles.selectedOption]}
                                        onPress={() => setSelectedSpeaker(speaker.value)}
                                    >
                                        <Text style={styles.optionLabel}>{speaker.label}</Text>
                                        {selectedSpeaker === speaker.value && (
                                            <Text style={styles.description}>{speaker.description}</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}

                                <Text style={styles.subHeader}>Select Background Ambience:</Text>
                                <FlatList
                                    data={ambienceOptions}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[styles.ambienceOption, selectedAmbience === item.value && styles.selectedAmbience]}
                                            onPress={() => setSelectedAmbience(item.value)}
                                        >
                                            <Image source={item.image} style={styles.ambienceImage} />
                                            <Text style={styles.ambienceLabel}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={item => item.value}
                                />

                                <Text style={styles.subHeader}>Select Time Duration:</Text>
                                <View style={styles.timeButtonsContainer}>
                                    {timeOptions.map((time, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.timeButton, selectedTime === time && styles.selectedTimeButton]}
                                            onPress={() => setSelectedTime(time)}
                                        >
                                            <Text style={styles.timeButtonText}>{time} min</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={styles.createButton}
                                    onPress={handleCreateMeditation}
                                >
                                    <Text style={styles.createButtonText}>Save Meditation</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
                ListFooterComponent={<View style={{ height: 20 }} />}
                contentContainerStyle={styles.scrollContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5EEE6",
        paddingTop: 40,
    },
    scrollContent: {
        paddingBottom: 20,
        paddingTop: 10,
    },
    content: {
        padding: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5264af',
        bottom: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    createButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
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
    subHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#37474F',
        marginTop: 20,
        marginBottom: 10,
    },
    option: {
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    selectedOption: {
        backgroundColor: "#c8e6c9",
    },
    optionLabel: {
        fontSize: 16,
        color: '#37474F',
    },
    meditationText: {
        fontSize: 16,
        color: "#37474F",
        marginBottom: 5,
    },
    description: {
        marginTop: 10,
        fontSize: 14,
        color: '#37474F',
    },
    ambienceOption: {
        marginRight: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    selectedAmbience: {
        backgroundColor: '#a19e9e',
        borderWidth: 10,
        borderColor: '#a19e9e',
    },
    ambienceImage: {
        width: 150,
        height: 100,
        borderRadius: 10,
    },
    ambienceLabel: {
        textAlign: 'center',
    },
    timeButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    timeButton: {
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    selectedTimeButton: {
        backgroundColor: "#c8e6c9",
    },
    timeButtonText: {
        fontSize: 16,
        color: '#37474F',
    },
    playButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    playIcon: {
        width: 24,
        height: 24,
    },
    createButton: {
        backgroundColor: '#78909C',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 20,
        width: contentWidth,
        marginHorizontal: 10,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'transparent',
        borderRadius: 12.5,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    deleteButtonText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'normal',
    },
    meditationSeparator: {
        height: 20,
    },
    cancelButton: {
        backgroundColor: "#BDBDBD",
        padding: 10,
    },
    savedMeditationItem: {
        alignSelf: 'center',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        width: contentWidth,
    },
    meditationDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    meditationContent: {
        flex: 1,
        marginRight: 10,
    },
    meditationTime: {
        fontSize: 20,
        color: "#37474F",
        marginLeft: 'auto',
    },
});

export default MeditationCreator;
