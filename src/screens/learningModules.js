import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const LearningModules = () => {
  const navigation = useNavigation();

  const downloadAndOpenFile = async (url, filename) => {
    try {
      // Downloading the file to the device's file system
      const result = await FileSystem.downloadAsync(
          url,
          FileSystem.documentDirectory + filename
      );

      Alert.alert(
          "Download Successful",
          "The file has been successfully downloaded and is ready to be opened. " +
          "After clicking 'Open', select 'Print' from the share options." +
          "Finally, select the save PDF button, " +
          "You can then rename and choose the location to save your file.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open",
              onPress: async () => {
                if (await Sharing.isAvailableAsync()) {
                  await Sharing.shareAsync(result.uri);
                } else {
                  Alert.alert("Error", "Sharing is not available on your device.");
                }
              },
            },
          ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while downloading the file.");
    }
  };

  const handleBackToDashboard = () => {
    navigation.goBack();
  };

  return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleBackToDashboard} style={styles.backButton}>
            <Image source={require("../image/back.png")} style={styles.backImage} />
          </TouchableOpacity>

          <Text style={styles.header}>Learning Modules</Text>

          <View style={styles.moduleContainer}>
            <Text style={styles.descriptionText}>
              Discover the keys to a balanced diet and how small changes can lead to long-term weight loss success and improved well-being.
            </Text>
            <TouchableOpacity style={styles.downloadButton} onPress={() => downloadAndOpenFile("https://assets.nhs.uk/tools/download-panels/data/weight-loss/pdf/all-weeks.pdf", "Losing_weight.pdf")}>
              <Text style={styles.buttonText}>Download NHS Diet Guide</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.moduleContainer}>
            <Text style={styles.descriptionText}>
              Learn about how regular exercise can benefit not only your body but also your mind, enhancing your mood and reducing stress levels.
            </Text>
            <TouchableOpacity style={styles.downloadButton} onPress={() => downloadAndOpenFile("https://www.sfh-tr.nhs.uk/media/9816/pil202207-02-heb-home-exercise-booklet.pdf", "Keeping_active.pdf")}>
              <Text style={styles.buttonText}>Download Active Lifestyle Tips</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.moduleContainer}>
            <Text style={styles.descriptionText}>
              Explore strategies and exercises designed to alleviate back pain, improving your posture and overall physical health.
            </Text>
            <TouchableOpacity style={styles.downloadButton} onPress={() => downloadAndOpenFile("https://www.wwl.nhs.uk/media/.leaflets/6578378ada2b29.79676253.pdf", "Back_pain.pdf")}>
              <Text style={styles.buttonText}>Download Back Pain Management</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.moduleContainer}>
            <Text style={styles.descriptionText}>
              Gain insights into strength training exercises that can help you build muscle, burn fat, and enhance your physical stamina.
            </Text>
            <TouchableOpacity style={styles.downloadButton} onPress={() => downloadAndOpenFile("https://www.kmpt.nhs.uk/media/2610/km1237-physiotherapy-strength-exercise-guide-1.pdf", "Strength_guide.pdf")}>
              <Text style={styles.buttonText}>Download Strength Training Guide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#F5EEE6",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    zIndex: 10,
  },
  backImage: {
    width: 50,
    height: 50,
  },
  header: {
    fontSize: 30,
    color: '#5264af',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  moduleContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    marginBottom: 20,
    elevation: 5,
  },
  descriptionText: {
    fontSize: 18,
    color: '#5264af',
    marginBottom: 10,
    lineHeight: 24,
  },
  downloadButton: {
    backgroundColor: '#5264af',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default LearningModules;
