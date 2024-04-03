import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { getFirestore, query, collection, where, getDocs, orderBy, limit } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import { useFocusEffect } from '@react-navigation/native';

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

const HealthData = ({ navigation }) => {
    const [waterHistoryData, setWaterHistoryData] = useState([]);
    const [calorieHistoryData, setCalorieHistoryData] = useState([]);

    const fetchHealthData = useCallback(async () => {
        const uid = await AsyncStorage.getItem("userUID");
        if (!uid) {
            console.log("User UID not found");
            return;
        }

        const today = new Date();
        today.setDate(today.getDate() - 4);
        const dateLimit = today.toISOString().split("T")[0];

        const healthQuery = query(
            collection(db, "healthData"),
            where("uid", "==", uid),
            where("date", ">=", dateLimit),
            orderBy("date", "asc"),
            limit(5)
        );

        try {
            const querySnapshot = await getDocs(healthQuery);
            const waterData = [];
            const calorieData = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                waterData.push({ date: data.date, waterIntake: data.waterIntake || 0 });
                calorieData.push({ date: data.date, calorieIntake: data.calorieIntake || 0 });
            });

            setWaterHistoryData(waterData);
            setCalorieHistoryData(calorieData);
        } catch (error) {
            console.error("Error fetching health data: ", error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchHealthData();
        }, [fetchHealthData])
    );

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}`;
    };

    const chartConfigWater = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(51, 67, 234, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        barPercentage: 0.5,
        fillShadowGradient: `rgba(82, 100, 175, 1)`,
        fillShadowGradientOpacity: 1,
    };

    const chartConfigFood = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(51, 67, 234, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        barPercentage: 0.5,
        fillShadowGradient: `rgb(98, 65, 65)`,
        fillShadowGradientOpacity: 1,
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image source={require("../image/back.png")} style={styles.backImage} />
            </TouchableOpacity>
            <Text style={styles.title}>Health Data</Text>

            <View style={styles.chartContainer}>
                <Text style={styles.chartText}>Water Intake History</Text>
                <BarChart
                    data={{
                        labels: waterHistoryData.map(item => formatDate(item.date)),
                        datasets: [{ data: waterHistoryData.map(item => item.waterIntake) }],
                    }}
                    width={350}
                    height={220}
                    yAxisSuffix="ml"
                    chartConfig={chartConfigWater}
                    fromZero={true}
                />
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.calorieChartText}>Calories History</Text>
                <BarChart
                    data={{
                        labels: calorieHistoryData.map(item => formatDate(item.date)),
                        datasets: [{ data: calorieHistoryData.map(item => item.calorieIntake) }],
                    }}
                    width={350}
                    height={220}
                    yAxisSuffix=" kcal"
                    chartConfig={{
                        ...chartConfigFood,
                        color: (opacity = 1) => `rgba(171, 120, 78, ${opacity})`,
                    }}
                    fromZero={true}
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
        paddingTop: 50,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 10,
        padding: 10,
        zIndex: 10,
    },
    backImage: {
        width: 40,
        height: 40,
    },
    title: {
        fontSize: 30,
        color: "#5264af",
        fontWeight: "bold",
        marginBottom: 20,
    },
    chartContainer: {
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#FFF",
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginTop: 50,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    chartText: {
        fontSize: 18,
        color: '#5264af',
        fontWeight: '600',
        marginBottom: 10,
    },
    calorieChartText: {
        fontSize: 18,
        color: '#bcaaa4',
        fontWeight: '600',
        marginBottom: 10,
    },
});

export default HealthData;
