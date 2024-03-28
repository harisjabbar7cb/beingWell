// App.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const BMI = () => {
    const navigation = useNavigation();
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmiResult, setBmiResult] = useState(null);

    const validateForm = () => {
        if (!age || !height || !weight) {
            alert('Please enter all fields');
        } else {
            countBmi();
        }
    };
    const handleBackToDashboard = () => {
        navigation.navigate('UserDashboard');
    };

    const countBmi = () => {
        const bmi = (parseFloat(weight) /
            ((parseFloat(height) / 100) ** 2)).toFixed(2);

        let result = '';
        if (bmi < 18.5) {
            result = 'Underweight';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            result = 'Healthy';
        } else if (bmi >= 25 && bmi <= 29.9) {
            result = 'Overweight';
        } else if (bmi >= 30 && bmi <= 34.9) {
            result = 'Obese';
        } else if (bmi >= 35) {
            result = 'Extremely obese';
        }

        // Set the BMI result
        setBmiResult({ bmi, result });

        // Reset the form
        setAge('');
        setHeight('');
        setWeight('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                BMI Calculator
            </Text>
            <View style={styles.form}>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>
                        Age
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your age"
                        onChangeText={setAge}
                        value={age}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>
                        Height (cm)
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your height"
                        onChangeText={setHeight}
                        value={height}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>
                        Weight (kg)
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your weight"
                        onChangeText={setWeight}
                        value={weight}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={validateForm}
                >
                    <Text style={styles.submitButtonText}>
                        Calculate BMI
                    </Text>
                </TouchableOpacity>
                {bmiResult && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultLabel}>
                            BMI:
                        </Text>
                        <Text style={styles.resultText}>
                            {bmiResult.bmi}
                        </Text>
                        <Text style={styles.resultLabel}>
                            Result:
                        </Text>
                        <Text style={styles.resultText}>
                            {bmiResult.result}
                        </Text>
                    </View>
                )}
            </View>
            <TouchableOpacity style={styles.backButton} onPress={handleBackToDashboard}>
                <Text style={styles.backButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5EEE6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 30,
        color: '#5264af',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        elevation: 5,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    label: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
        color: '#5264af',
    },
    textInput: {
        flex: 2,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingLeft: 10,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#5264af',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    resultContainer: {
        marginTop: 20,
    },
    resultLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#5264af',
    },
    resultText: {
        fontSize: 16,
        color: '#5264af',
    },
    backButton: {
        backgroundColor: '#D9534F',
        marginTop: 20,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BMI;
