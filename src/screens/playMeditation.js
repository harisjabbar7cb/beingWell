import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Audio } from 'expo-av';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Svg, { Circle, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const circleSize = screenWidth * 0.8;
const strokeWidth = 10;
const radius = circleSize / 2 - strokeWidth / 2;
const circumference = radius * 2 * Math.PI;

const PlayMeditation = ({ route, navigation }) => {
    const { ambience, speaker, time } = route.params;
    const [remainingTime, setRemainingTime] = useState(time * 60);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const storage = getStorage();
    const combinedAudio = useRef(new Audio.Sound());
    const [showBackButton, setShowBackButton] = useState(false);

    const ambienceGradients = {
        nature: ['#00441b', '#006d2c', '#238b45'],
        city: ['#0c2461', '#1e3799', '#4a69bd'],
        night: ['#1a237e', '#283593', '#5f5fc4'],
        binauralBeats: ['#006064', '#0097a7', '#00bcd4'],
        lofiHipHop: ['#4e342e', '#6d4c41', '#8d6e63'],
    };

    useFocusEffect(
        useCallback(() => {
            setShowBackButton(false);
            const backBtnTimer = setTimeout(() => setShowBackButton(true), 5000);
            const audioFileName = speaker === 'none' ? `${ambience}` : `${speaker}${ambience}`;
            loadAndPlayAudio(combinedAudio, `${audioFileName}.mp3`);

            return () => {
                clearTimeout(backBtnTimer);
                if (combinedAudio.current) {
                    combinedAudio.current.stopAsync();
                    combinedAudio.current.unloadAsync();
                }
            };
        }, [ambience, speaker])
    );

    const loadAndPlayAudio = async (soundObject, filePath, volume = 1) => {
        try {
            const downloadUrl = await getDownloadURL(ref(storage, filePath));
            await soundObject.current.unloadAsync();
            await soundObject.current.loadAsync({ uri: downloadUrl }, {}, false);
            await soundObject.current.setVolumeAsync(volume);
            if (isPlaying) {
                await soundObject.current.playAsync();
            }
        } catch (error) {
            console.error("Error loading audio:", error);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            const id = setInterval(() => {
                setRemainingTime((prevTime) => {
                    const newTime = prevTime - 1;
                    setProgress(((time * 60 - newTime) / (time * 60)) * circumference);
                    if (newTime <= 0) {
                        clearInterval(id);
                        navigation.goBack();
                    }
                    return Math.max(newTime, 0);
                });
            }, 1000);
            return () => clearInterval(id);
        }
    }, [isPlaying, time]);

    const handlePlayPauseToggle = async () => {
        setIsPlaying(!isPlaying);
        const audioStatus = await combinedAudio.current.getStatusAsync();
        if (audioStatus.isLoaded) {
            if (!isPlaying) {
                await combinedAudio.current.playAsync();
            } else {
                await combinedAudio.current.pauseAsync();
            }
        }
    };

    const handleBack = async () => {
        navigation.goBack();
    };

    const getDisplayName = (name) => {
        switch (name) {
            case 'alanWatts': return 'Alan Watts';
            case 'binauralBeats': return 'Binaural Beats';
            case 'none': return 'No Speaker';
            case 'lofiHipHop': return 'Lofi Hip-Hop';
            default: return name.charAt(0).toUpperCase() + name.slice(1);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={ambienceGradients[ambience] || ['#4c669f', '#3b5998', '#192f6a']}
                style={styles.backgroundGradient}
            />
            {showBackButton && (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Image source={require('../image/back.png')} style={styles.backImage} />
                </TouchableOpacity>
            )}
            <View style={styles.textContainer}>
                <Text style={styles.ambienceText}>{getDisplayName(ambience)} Ambience</Text>
                <Text style={styles.speakerText}>{getDisplayName(speaker)}</Text>
            </View>
            <Svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`} onPress={handlePlayPauseToggle}>
                <G rotation="-90" origin={`${circleSize / 2}, ${circleSize / 2}`}>
                    <Circle
                        stroke="#E0E0E0"
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        stroke="#03A9F4"
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                    />
                </G>
            </Svg>
            <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
            <TouchableOpacity onPress={handlePlayPauseToggle} style={styles.playPauseButton}>
                <Image source={isPlaying ? require('../image/pause.png') : require('../image/play.png')} style={styles.playPauseImage} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    textContainer: {
        position: 'absolute',
        top: 100,
        alignItems: 'center',
    },
    ambienceText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'capitalize',
    },
    speakerText: {
        fontSize: 20,
        color: 'white',
        textTransform: 'capitalize',
        marginTop: 4,
    },
    timerText: {
        position: 'absolute',
        fontSize: 48,
        fontWeight: 'bold',
        letterSpacing: -2,
        color: '#ffffff',
        textAlign: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    backImage: {
        width: 50,
        height: 50,
    },
    playPauseButton: {
        position: 'absolute',
        bottom: 50,
    },
    playPauseImage: {
        width: 50,
        height: 50,
    },
});

export default PlayMeditation;
