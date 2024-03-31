import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, orderBy} from 'firebase/firestore';

import { initializeApp } from 'firebase/app';
import {firebaseConfig} from '../firebaseConfig';



const HealthData = ({ route, navigation }) => {
    const [waterHistory, setWaterHistory] = useState([]);
    const [caloriesHistory, setCaloriesHistory] = useState([]);

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    // Get the Auth instance
    const auth = getAuth();


    // Get the currently logged-in user
    const user = auth.currentUser;

    const userId = user.uid;


    useEffect(() => {
        const fetchIntake = async () => {
          // Calculate the date 7 days ago
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
          const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    
          // Reference to the healthData collection
          const healthDataRef = collection(db, 'healthData');
          
    
          // Create a query against the collection
          const q = query(
            healthDataRef,
            where('uid', '==', userId),
            where('date', '>=', sevenDaysAgoStr),
            orderBy('date', 'asc') 
          );
          
    
          try {
            const querySnapshot = await getDocs(q);
            const waterData = querySnapshot.docs.map(doc => ({
              date: doc.data().date,
              waterIntake: doc.data().waterIntake,
            }));
            const calorieData = querySnapshot.docs.map(doc => ({
                date: doc.data().date,
                calorieIntake: doc.data().calorieIntake,
            }));

            
            setWaterHistory(waterData);
            setCaloriesHistory(calorieData)
          } catch (error) {
            
            console.error("Error fetching water intake data: ", error);
          }
        };
    
        fetchIntake();
      }, []); // Effect runs only once on component mount

      

    const transformDates = (HistoryData) => (
        HistoryData.map(item => {
            // Split the date string into parts
            const parts = item.date.split('-');
            // Rearrange the parts to get "Day/Month"
            return (parts[2] + "/" + parts[1]);
        })
    );
        
    
    const waterData = {
        labels: transformDates(waterHistory),
        
        datasets: [
            {
                data: waterHistory.map(item => item.waterIntake),
            },
        ],
    };

    const calorieData = {
        labels: transformDates(caloriesHistory),
        datasets: [
            {
                data: caloriesHistory.map(item => item.calorieIntake),
            },
        ],
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <Image
                    source={require('../image/back.png')}
                    style={styles.backImage}
                />
            </TouchableOpacity>
            <Text style={styles.title}>Health Data</Text>
            <View style={styles.chartContainer}>
                <Text style={styles.chartText}>Water Intake History</Text>
                <BarChart
                    data={waterData}
                    width={350}
                    height={220}
                    yAxisSuffix="ml"
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(82, 100, 175, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        barPercentage: 0.5,
                        useShadowColorFromDataset: false,
                        fillShadowGradient: `rgba(82, 100, 175, 1)`,
                        fillShadowGradientOpacity: 1,
                    }}
                />
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.calorieChartText}>Calories History</Text>
                <BarChart
                    data={calorieData}
                    width={350}
                    height={220}
                    yAxisSuffix="ml"
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(171, 120, 78, ${opacity})`, 
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        barPercentage: 0.5,
                        useShadowColorFromDataset: false,
                        fillShadowGradient: `rgba(171, 120, 78, 1)`,
                        fillShadowGradientOpacity: 1,
                    }}
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
        marginTop: 8,
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
    chartStyle: {
        marginVertical: 8,
        borderRadius: 16,
    },
});

export default HealthData;
