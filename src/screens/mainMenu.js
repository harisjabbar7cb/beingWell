import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';

initializeApp(firebaseConfig);
const db = getFirestore();

const WidgetButton = ({ icon, title, onPress, children }) => (
    <TouchableOpacity style={styles.widget} onPress={onPress}>
        {icon === "water" ? (
            <FontAwesome5 name="tint" size={24} color="#5264af" style={styles.icon} />
        ) : (
            <FontAwesome5 name={icon} size={24} color="#5264af" style={styles.icon} />
        )}
        <Text style={styles.widgetText}>{title}</Text>
        {children}
    </TouchableOpacity>
);

const UserDashboard = ({ navigation }) => {
    const [waterIntake, setWaterIntake] = useState(0);
    const [calorieInput, setCalorieInput] = useState('');
    const [totalCalories, setTotalCalories] = useState(0);

    useEffect(() => {
        const fetchIntakeData = async () => {
            const uid = await AsyncStorage.getItem('userUID');
            const today = new Date().toISOString().split('T')[0];

            const q = query(collection(db, "healthData"), where("uid", "==", uid), where("date", "==", today));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Assuming 'waterIntake' and 'calories' are fields in the document
                setWaterIntake(data.waterIntake || 0);
                setTotalCalories(data.calories || 0);
            });
        };

        fetchIntakeData();
    }, []);

    const updateIntakeData = async (field, intake) => {
        const uid = await AsyncStorage.getItem('userUID');
        const today = new Date().toISOString().split('T')[0];
        const docRef = doc(collection(db, "healthData"), `${uid}_${today}`);
        // Prepare data to update
        const dataToUpdate = {};
        dataToUpdate[field] = intake;

        await setDoc(docRef, {
            ...dataToUpdate,
            uid,
            date: today,
        }, { merge: true });


        if (field === "waterIntake") {
            setWaterIntake(intake);
        } else if (field === "calories") {
            setTotalCalories(intake);
        }
    };

    const incrementWaterIntake = () => {
        const newIntake = waterIntake + 100;
        if (newIntake <= 5000) {
            updateIntakeData("waterIntake", newIntake);
        } else {
            Alert.alert("Warning", "You are at risk of overhydration!");
        }
    };

    const decrementWaterIntake = () => {
        const newIntake = waterIntake - 100;
        if (newIntake >= 0) {
            updateIntakeData("waterIntake", newIntake);
        } else {
            Alert.alert("Notice", "Water intake cannot be negative.");
        }
    };

    const handleAddCalories = () => {
        const inputCalories = parseInt(calorieInput, 10);
        if (!isNaN(inputCalories) && inputCalories <= 10000 && inputCalories >= 0) {
            const newIntake = totalCalories + inputCalories;
            updateIntakeData("calories", newIntake);
            setCalorieInput('');
        } else {
            Alert.alert("Invalid Input", "Please enter a number between 0 and 10,000.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>BeingWell</Text>
            <View style={styles.widgetsContainer}>

                <WidgetButton icon="water" title="" onPress={() => navigation.navigate('HealthData')}>
                    <View style={styles.waterButtonContainer}>
                        <Text style={styles.trackerText}>Water Intake: {waterIntake} ml</Text>
                        <View style={styles.horizontalButtonContainer}>
                            <TouchableOpacity style={styles.button} onPress={decrementWaterIntake}>
                                <FontAwesome5 name="minus" size={16} color="#5264af" />
                            </TouchableOpacity>
                            <Text style={styles.buttonText}>100ml</Text>
                            <TouchableOpacity style={styles.button} onPress={incrementWaterIntake}>
                                <FontAwesome5 name="plus" size={16} color="#5264af" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </WidgetButton>


                <WidgetButton icon="utensils" title="" onPress={() => navigation.navigate('HealthData')}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1}}>
                        <Text style={[styles.trackerText, {flexShrink: 1}]}>Calories: {totalCalories} kcal</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TextInput
                                style={styles.calorieInput}
                                placeholder="Enter"
                                keyboardType="numeric"
                                value={calorieInput}
                                onChangeText={setCalorieInput}
                                maxLength={5}
                            />
                            <TouchableOpacity style={[styles.incrementButton, { marginLeft: 10 }]} onPress={handleAddCalories}>
                                <FontAwesome5 name="check" size={16} color="#5264af" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </WidgetButton>



                <WidgetButton icon="calculator" title="BMI Calculator" onPress={() => navigation.navigate('bmi')}/>
                <WidgetButton icon="book" title="Your Journal" onPress={() => navigation.navigate('journal')}/>
                <WidgetButton icon="newspaper" title="Forum"  onPress={() => navigation.navigate('forum')} />
                <WidgetButton icon="spa" title="Meditation"  onPress={() => navigation.navigate('meditation')} />
                <WidgetButton icon="book-open" title="Learning Modules" onPress={() => {}}>
                </WidgetButton>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5EEE6",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 30,
        color: "#5264af",
        fontWeight: "bold",
    },
    widgetsContainer: {
        width: '100%',
        marginTop: 20,
    },
    widget: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#FFF",
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    incrementButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginLeft: 40,
    },
    incrementIcon: {
        marginRight: 10,
    },
    incrementText: {
        fontSize: 16,
        color: '#5264af',
        fontWeight: '600',
    },

    icon: {
        marginRight: 20,
    },
    widgetText: {
        fontSize: 18,
        color: '#5264af',
        fontWeight: '600',
    },
    modulesList: {
        width: '100%',
        paddingHorizontal: 20,
    },
    moduleItem: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    moduleTitle: {
        fontSize: 18,
        color: '#5264af',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    moduleSummary: {
        fontSize: 16,
        color: '#000',
    },
    trackerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#FFF",
        padding: 20,
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    trackerText: {
        fontSize: 18,
        color: '#5264af',
        fontWeight: '600',
    },
    calorieInput: {
        borderWidth: 1,
        borderColor: '#5264af',
        padding: 10,
        width: 100,
        borderRadius:20
    },
    addButton: {
        padding: 10,
    },
    waterContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    verticalButtonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 20,
    },
    smallButton: {

        backgroundColor: '#E0E0E0',
        padding: 6,
        borderRadius: 10,
        marginBottom: 5,
    },
    waterButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    horizontalButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#E0E0E0',
        padding: 8,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#5264af',
        fontWeight: '600',
    },
});

export default UserDashboard;
