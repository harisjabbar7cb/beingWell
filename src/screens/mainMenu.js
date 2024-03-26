import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const WidgetButton = ({ icon, title }) => (
    <TouchableOpacity style={styles.widget}>
        <FontAwesome5 name={icon} size={24} color="#5264af" style={styles.icon} />
        <Text style={styles.widgetText}>{title}</Text>
    </TouchableOpacity>
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
    {
        id: '3',
        title: 'Sleep Hygiene',
        summary: 'Find out how better sleep can significantly improve your health.',
    },
];

const ModuleItem = ({ title, summary }) => (
    <View style={styles.moduleItem}>
        <Text style={styles.moduleTitle}>{title}</Text>
        <Text style={styles.moduleSummary}>{summary}</Text>
    </View>
);
const UserDashboard = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>BeingWell</Text>
            <View style={styles.widgetsContainer}>
                <WidgetButton icon="tint" title="Water Intake" />
                <WidgetButton icon="utensils" title="Food Tracking" />
                <WidgetButton icon="bed" title="Sleep Monitor" />
                <WidgetButton icon="walking" title="Steps Count" />
                <FlatList
                    data={MODULES_DATA}
                    renderItem={({ item }) => <ModuleItem title={item.title} summary={item.summary} />}
                    keyExtractor={item => item.id}
                    style={styles.modulesList}
                />
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
});

export default UserDashboard;
