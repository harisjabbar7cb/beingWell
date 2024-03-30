import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const WidgetButton = ({ icon, title, onPress, children}) => (
    <TouchableOpacity style={styles.widget} onPress={onPress}>
        <FontAwesome5 name={icon} size={24} color="#5264af" style={styles.icon} />
        <Text style={styles.widgetText}>{title}</Text>
        {children}
    </TouchableOpacity>
);

const ModuleItem = ({ title, summary }) => (
    <View style={styles.moduleItem}>
        <Text style={styles.moduleTitle}>{title}</Text>
        <Text style={styles.moduleSummary}>{summary}</Text>
    </View>
);

const fetchWaterIntakeData = async () => {
    // Simulating fetching data from Firebase (replace this with actual Firebase code)
    return [
        { date: '03/25', waterIntake: 1750 },
        { date: '03/26', waterIntake: 2500 },
        { date: '03/27', waterIntake: 2200 },
        { date: '0328', waterIntake: 1800 },
        { date: '03/29', waterIntake: 3000 },
        { date: '03/30', waterIntake: 1200 },
        { date: '03/31', waterIntake: 2100 },
    ];
};


const UserDashboard = ({ navigation }) => {
    const [waterIntake, setWaterIntake] = useState(0);
    const [pastSevenDaysData, setPastSevenDaysData] = useState([]);
    const [calorieInput, setCalorieInput] = useState('');
    const [totalCalories, setTotalCalories] = useState(0);
    const [selectedMood, setSelectedMood] = useState('');

    useEffect(() => {
        fetchWaterIntakeData().then(data => {
            setPastSevenDaysData(data);
        }).catch(error => {
            console.error("Error fetching data:", error);
        });
    }, []);

    const incrementWaterIntake = () => {
        if (waterIntake >= 5000) {
            Alert.alert("Warning", "You are at risk of overhydration!");

        }
        setWaterIntake(waterIntake + 100);
    };

    const decrementWaterIntake = () => {
        if (!(waterIntake == 0)) {
            setWaterIntake(waterIntake - 100);
        }
    }

    const handleAddCalories = () => {
        const inputCalories = parseInt(calorieInput, 10);
        if (isNaN(inputCalories) || inputCalories > 10000 || inputCalories < 0) {
            Alert.alert("Invalid Input", "Please enter a number between 0 and 10,000.");
            return;
        }
        setTotalCalories(totalCalories + inputCalories);
        setCalorieInput('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>BeingWell</Text>
            <View style={styles.widgetsContainer}>

                <WidgetButton icon="water" title="" onPress={() => navigation.navigate('HealthData',{pastSevenDaysData})}>
                    <View style={styles.waterContainer}>
                        <Text style={styles.trackerText}>Water Intake: {waterIntake} ml</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.incrementButton} onPress={incrementWaterIntake}>
                                <FontAwesome5 name="plus" size={24} color="#5264af" style={styles.incrementIcon} />
                                <Text style={styles.incrementText}>100ml</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.incrementButton} onPress={decrementWaterIntake}>
                                <FontAwesome5 name="minus" size={24} color="#5264af" style={styles.incrementIcon} />
                                <Text style={styles.incrementText}>100ml</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </WidgetButton> 

                <View style={styles.trackerContainer}>
                        <Text style={styles.trackerText}>Calories: {totalCalories} </Text>
                        <TextInput
                                style={styles.calorieInput}
                                placeholder="Enter"
                                keyboardType="numeric"
                                value={calorieInput}
                                onChangeText={setCalorieInput}
                                maxLength={5}
                        />
                        <TouchableOpacity style={styles.incrementButton} onPress={handleAddCalories}>
                            <FontAwesome5 name="check" size={24} color="#5264af" style={styles.incrementIcon} />

                            <Text style={styles.incrementText}>Add</Text>
                        </TouchableOpacity>
                </View>

                <WidgetButton icon="calculator" title="BMI Calculator" onPress={() => navigation.navigate('bmi')}/>
                <WidgetButton icon="book" title="Your Journal" onPress={() => navigation.navigate('journal')}/>
                <WidgetButton icon="newspaper" title="Forum"  onPress={() => navigation.navigate('forum')} />
                <WidgetButton icon="spa" title="Meditation"  onPress={() => navigation.navigate('meditation')} />
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
        marginRight: 10,
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
    }   
});

export default UserDashboard;
