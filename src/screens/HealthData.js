// HealthData.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";

const HealthData = ({route,navigation }) => {
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
      <Text style={styles.title}>Health data</Text>
      <View style={styles.chartContainer}>
          <Text style={styles.chartText}>Water Intake History</Text>
          <View style={styles.chart}>
                <BarChart style={styles.chartStyle}
                    data={data}
                    width={350}
                    height={200}
                    yAxisSuffix="ml"
                    chartConfig={{
                        backgroundColor: "#FFF",
                        backgroundGradientFrom: '#FFF',
                        backgroundGradientTo: '#FFF',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(82, 100, 175, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(82, 100, 175, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                />
            </View>
      </View>
      <Button
        title="View Your Sleep Data"
        onPress={() => navigation.navigate('SleepData', {
            screen: 'Dashboard',
        })}
      />
      <Button
        title="Back to Dashboard"
        onPress={() => navigation.navigate('UserDashboard', {
            screen: 'Dashboard',
        })}
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
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
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
  chart: {
    padding: 5,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartText: {
    fontSize: 18,
    color: '#5264af',
    fontWeight: '600',
  },
});

export default HealthData;
