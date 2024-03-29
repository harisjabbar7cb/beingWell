import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const WidgetButton = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.widget} onPress={onPress}>
        <FontAwesome5 name={icon} size={24} color="#5264af" style={styles.icon} />
        <Text style={styles.widgetText}>{title}</Text>
    </TouchableOpacity>
);

const ModuleItem = ({ title, summary }) => (
    <View style={styles.moduleItem}>
        <Text style={styles.moduleTitle}>{title}</Text>
        <Text style={styles.moduleSummary}>{summary}</Text>
    </View>
);

const MODULES_DATA = [
    {
        id: '1',
        title: 'Understanding Nutrition',
        summary: 'Learn the basics of nutrition and how it affects your body.',
    },
    {
        id: '2',
        title: 'Benefits of Regular Exercise',
        summary: 'Discover how regular exercise can improve your overall health.',
    },

];

const UserDashboard = ({ navigation }) => {
    const [waterIntake, setWaterIntake] = useState(0);
    const [calorieInput, setCalorieInput] = useState('');
    const [totalCalories, setTotalCalories] = useState(0);

    const incrementWaterIntake = () => {
        if (waterIntake >= 15) {
            Alert.alert("Warning", "You are at risk of overhydration!");

        }
        setWaterIntake(waterIntake + 1);
    };

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
                <View style={styles.trackerContainer}>
                    <Text style={styles.trackerText}>Water Intake: {waterIntake}</Text>
                    <TouchableOpacity onPress={incrementWaterIntake}>
                        <FontAwesome5 name="plus" size={24} color="#5264af" />
                    </TouchableOpacity>
                </View>
                <View style={styles.trackerContainer}>
                    <Text style={styles.trackerText}>Total Calories: {totalCalories}</Text>
                    <TextInput
                        style={styles.calorieInput}
                        placeholder="Add..."
                        keyboardType="numeric"
                        value={calorieInput}
                        onChangeText={setCalorieInput}
                        maxLength={5}
                    />
                    <TouchableOpacity onPress={handleAddCalories}>
                        <FontAwesome5 name="check" size={24} color="#5264af" />
                    </TouchableOpacity>
                </View>
                <WidgetButton icon="calculator" title="BMI Calculator" onPress={() => navigation.navigate('bmi')} />
                <WidgetButton icon="book" title="Your Journal" onPress={() => navigation.navigate('journal')}/>
                <WidgetButton icon="newspaper" title="Forum"  onPress={() => navigation.navigate('forum')} />
            </View>
            <FlatList
                data={MODULES_DATA}
                renderItem={({ item }) => <ModuleItem title={item.title} summary={item.summary} />}
                keyExtractor={item => item.id}
                style={styles.modulesList}
            />
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
    },
    addButton: {
        padding: 10,
    },
});

export default UserDashboard;
