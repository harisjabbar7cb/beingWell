// StepDATA.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const StepData = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Step Data</Text>
      <Text>hahahehetesting</Text>
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

export default StepData;
