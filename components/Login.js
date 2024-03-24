import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useFonts } from 'expo-font';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isUsernameFocused, setUsernameFocused] = useState(false); // Added
    const [isPasswordFocused, setPasswordFocused] = useState(false); // Added

    const buttonOpacity = useSharedValue(1);

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: buttonOpacity.value,
        };
    });

    const [fontsLoaded] = useFonts({
        'Lato-Black': require('../assets/fonts/Lato-Black.ttf'),
    });

    const loginButton = () => {
        console.log('Login with: ', username, password);
        buttonOpacity.value = withTiming(1, {
            duration: 200,
        });
    };

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>BeingWell</Text>

            <TextInput
                style={[
                    styles.input,
                    isUsernameFocused && styles.inputFocused,
                ]}
                placeholder="Username"
                placeholderTextColor="#CCC"
                onChangeText={setUsername}
                value={username}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
            />

            <TextInput
                style={[
                    styles.input,
                    isPasswordFocused && styles.inputFocused,
                ]}
                placeholder="Password"
                placeholderTextColor="#CCC"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
            />

            <AnimatedTouchableOpacity onPress={loginButton} style={[styles.button, animatedButtonStyle]}>
                <Text style={styles.buttonText}>Login</Text>
            </AnimatedTouchableOpacity>
        </View>
    );
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 50,
        marginBottom: 30,
        color: "#000000",
        fontFamily: "Lato-Black",
        fontWeight: "bold",
    },
    input: {
        height: 50,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        width: 300,
        borderRadius: 5,
        borderColor: "#F0F0F0",
        color: "#000000",
        backgroundColor: "#F0F0F0",

    },
    inputFocused: {
        borderColor: "#000000",
    },
    button: {
        backgroundColor: "#000000",
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
        color: "#ffffff",
        fontSize: 16,
        fontFamily: "Lato-Black"
    },
});
export default Login;
