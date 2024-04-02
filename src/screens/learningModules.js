import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

const LearningModules = ({ navigation }) => {
  const save = async (url) => {
    shareAsync(url);
  };

  const downloadNHSdiet = async () => {
    const filename = "Losing_weight.pdf";
    const result = await FileSystem.downloadAsync(
      "https://assets.nhs.uk/tools/download-panels/data/weight-loss/pdf/all-weeks.pdf",
      FileSystem.documentDirectory + filename
    );
    save(result.uri);
  };

  const downloadNHSactive = async () => {
    const filename = "Keeping_active.pdf";
    const result = await FileSystem.downloadAsync(
      "https://www.sfh-tr.nhs.uk/media/9816/pil202207-02-heb-home-exercise-booklet.pdf",
      FileSystem.documentDirectory + filename
    );
    save(result.uri);
  };

  const downloadNHSback = async () => {
    const filename = "Back_pain.pdf";
    const result = await FileSystem.downloadAsync(
      "https://www.wwl.nhs.uk/media/.leaflets/6578378ada2b29.79676253.pdf",
      FileSystem.documentDirectory + filename
    );
    save(result.uri);
  };

  const downloadNHSstrength = async () => {
    const filename = "Strength_guide.pdf";
    const result = await FileSystem.downloadAsync(
      "https://www.kmpt.nhs.uk/media/2610/km1237-physiotherapy-strength-exercise-guide-1.pdf",
      FileSystem.documentDirectory + filename
    );
    save(result.uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Learning Modules</Text>

      <TouchableOpacity style={styles.downloadButton} onPress={downloadNHSdiet}>
        <Text style={styles.submitButtonText}>Download NHS Diet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={downloadNHSactive}
      >
        <Text style={styles.submitButtonText}>Download NHS Active</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.downloadButton} onPress={downloadNHSback}>
        <Text style={styles.submitButtonText}>Download NHS Back Pain</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={downloadNHSstrength}
      >
        <Text style={styles.submitButtonText}>Download NHS Strength Guide</Text>
      </TouchableOpacity>

      <Button
        title="Go back to dashboard"
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
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 30,
    color: "#5264af",
    fontWeight: "bold",
    marginBottom: 20,
  },
  downloadButton: {
    margin: 10,
    padding: 15,
    backgroundColor: "#5264af",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default LearningModules;
