import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTimin } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebaseConfig} from '../firebaseConfig';
import {Image} from 'react-native';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';

// Initialize Firebaseadmin
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Auth with persistence to allow reentry
let auth;
try {
    auth = getAuth(app); // Attempt to get the existing auth instance
} catch {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isUsernameFocused, setUsernameFocused] = useState(false);
    const [isPasswordFocused, setPasswordFocused] = useState(false);
    const navigation = useNavigation();
    const buttonOpacity = useSharedValue(1);
    const storeUID = async (uid) => {
        try {
            await AsyncStorage.setItem('userUID', uid);
        } catch (e) {
            // Saving error
            console.log("Error storing the UID: ", e);
        }
    };

    const login = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;
            // Store user UID for later use in DB syncing
            await storeUID(user.uid);

            // Fetch user information
            const usersCollectionRef = collection(db, 'users');
            const userQuerySnapshot = await getDocs(query(usersCollectionRef, where('email', '==', username)));

            if (!userQuerySnapshot.empty) {
                const userDocSnapshot = userQuerySnapshot.docs[0];
                console.log("User Details: ", userDocSnapshot.data());
                // Add logic here to store user details as needed
            } else {
                console.log("No user details found!");
            }

            // Navigate based on user role
            if (username === 'admin@fdm.com') {
                navigation.navigate('AdminDashboard');
            } else {
                navigation.navigate('UserDashboard');
            }
        } catch (error) {
            let errorMessage;
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = "No user found with this email.";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "Incorrect password. Please try again.";
                    break;
                default:
                    errorMessage = "Login failed. Please try again.";
            }
            Alert.alert(errorMessage);
        }
    };

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: buttonOpacity.value,
        };
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>BeingWell</Text>

            <TextInput
                style={[styles.input, isUsernameFocused && styles.inputFocused]}
                placeholder="Username"
                placeholderTextColor="#CCC"
                onChangeText={setUsername}
                value={username}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
            />

            <TextInput
                style={[styles.input, isPasswordFocused && styles.inputFocused]}
                placeholder="Password"
                placeholderTextColor="#CCC"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
            />

            <AnimatedTouchableOpacity onPress={login} style={[styles.button, animatedButtonStyle]}>
                <Text style={styles.buttonText}>Login</Text>
            </AnimatedTouchableOpacity>
            <Image
                source={require('../image/login.png')} // Adjust the path as needed
                style={styles.loginImage}
            />
        </View>

    );
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5EEE6",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 50,
        marginBottom: 30,
        color: "#5264af",
        fontWeight: "bold",
        paddingTop:25
    },
    input: {
        height: 50,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        width: 300,
        borderRadius: 5,
        borderColor: "#FFF8E3",
        color: "#000000",
        backgroundColor: "#FFF8E3",
    },
    inputFocused: {
        borderColor: "#F3D7CA",
    },
    button: {
        backgroundColor: "#a16dbe",
        padding: 15,
        borderRadius: 5,
        width: 150,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
    buttonText: {
        color:"#FFF8E3",
        fontSize: 18,

    },
    loginImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        marginTop:30

    },
});

export default Login;
