// SleepData.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const SleepData = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sleep Data</Text>
      <Text>adding test </Text>
      <Button
        title="Go to Health Data"
        onPress={() => navigation.navigate("HealthData")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default SleepData;
