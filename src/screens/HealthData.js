import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { BarChart } from "react-native-chart-kit";

const HealthData = ({ route, navigation }) => {
    const pastSevenDaysData = route.params ? route.params.pastSevenDaysData : [];

    const data = {
        labels: pastSevenDaysData.map(item => item.date),
        datasets: [
            {
                data: pastSevenDaysData.map(item => item.waterIntake),
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
                    data={data}
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
    chartStyle: {
        marginVertical: 8,
        borderRadius: 16,
    },
});

export default HealthData;
