// HealthData.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const HealthData = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Health data</Text>
      <Button
        title="View Your Step Data"
        onPress={() => navigation.navigate("StepData")}
      />
      <Button
        title="View Your Sleep Data"
        onPress={() => navigation.navigate("SleepData")}
      />
      <Button
        title="Back to Dashboard"
        onPress={() => navigation.navigate("UserDashboard")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default HealthData;
