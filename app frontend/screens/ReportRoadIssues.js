"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import MapModal from "../MapModal"
import * as ImagePicker from "expo-image-picker"
// Add import for report storage
import { saveReport } from "./ReportStorage"

const ReportRoadIssue = ({ navigation }) => {
  
  const [description, setDescription] = useState("")
  const [issueType, setIssueType] = useState("")
  const [severityLevel, setSeverityLevel] = useState("Low")
  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const issueTypes = ["Pothole", "Road Damage", "Traffic Light Issue", "Sign Problem", "Debris on Road", "Other"]

  const handleLocationSelect = (selectedLocation, coords) => {
    setLocation(selectedLocation)
    setCoordinates(coords)
    setShowMap(false)
  }

  // Update the handleFinish function to save the report
  const handleFinish = async () => {
    if ( !description || !issueType || !location) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    const reportData = {
    
      description,
      issueType,
      severityLevel,
      location,
      coordinates,
      image: selectedImage,
    }

    try {
      // Save report to storage
      await saveReport(reportData)

      console.log("Report submitted:", reportData)
      Alert.alert("Success", "Road issue reported successfully!")

      // Reset form
     
      setDescription("")
      setIssueType("")
      setSeverityLevel("Low")
      setLocation("")
      setCoordinates(null)
      setSelectedImage(null)
    } catch (error) {
      Alert.alert("Error", "Failed to save report. Please try again.")
    }
  }

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert("Permission Required", "Camera and photo library access are required to attach photos.")
      return false
    }
    return true
  }

  const showImagePickerOptions = async () => {
    const hasPermissions = await requestPermissions()
    if (!hasPermissions) return

    Alert.alert("Select Photo", "Choose how you want to add a photo", [
      { text: "Camera", onPress: openCamera },
      { text: "Gallery", onPress: openGallery },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0])
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open camera")
    }
  }

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0])
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open gallery")
    }
  }

  const removeImage = () => {
    Alert.alert("Remove Photo", "Are you sure you want to remove this photo?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => setSelectedImage(null) },
    ])
  }

  const SeverityButton = ({ level, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.severityButton,
        isSelected && styles.severityButtonSelected,
        level === "Low" && isSelected && styles.lowSelected,
        level === "Medium" && isSelected && styles.mediumSelected,
        level === "High" && isSelected && styles.highSelected,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.severityButtonText, isSelected && styles.severityButtonTextSelected]}>{level}</Text>
    </TouchableOpacity>
  )

  // Update the header section to include a reports button
  return (
    <SafeAreaView style={styles.container}>
    

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
        </View> */}
<View style={styles.section}>
          <Text style={styles.label}>Select Issue Type</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={issueType} onValueChange={setIssueType} style={styles.picker}>
              <Picker.Item label="Select Issue Type" value="" />
              {issueTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the issue (e.g., deep potholes causing traffic, waterlogged area near school, etc.)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        

        <View style={styles.section}>
          <Text style={styles.label}>Severity Level</Text>
          <View style={styles.severityContainer}>
            <SeverityButton level="Low" isSelected={severityLevel === "Low"} onPress={() => setSeverityLevel("Low")} />
            <SeverityButton
              level="Medium"
              isSelected={severityLevel === "Medium"}
              onPress={() => setSeverityLevel("Medium")}
            />
            <SeverityButton
              level="High"
              isSelected={severityLevel === "High"}
              onPress={() => setSeverityLevel("High")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location Selection</Text>
          <View style={styles.locationContainer}>
            <TouchableOpacity style={styles.locationInput} onPress={() => setShowMap(true)}>
              <Text style={[styles.locationText, !location && styles.placeholder]}>{location || "Location"}</Text>
              <View style={styles.locationIcons}>
                {location && (
                  <TouchableOpacity
                    style={styles.clearLocationButton}
                    onPress={() => {
                      setLocation("")
                      setCoordinates(null)
                    }}
                  >
                    <Text style={styles.clearLocationIcon}>✕</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.mapIcon}>📍</Text>
              </View>
            </TouchableOpacity>
          </View>
          {coordinates && (
            <View>
              <Text style={styles.coordinatesText}>
                📍 {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
              </Text>
              {coordinates.accuracy && (
                <Text style={styles.accuracyText}>Accuracy: ±{Math.round(coordinates.accuracy)}m</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Attach Photo</Text>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              <View style={styles.imageActions}>
                <TouchableOpacity style={styles.changeImageButton} onPress={showImagePickerOptions}>
                  <Text style={styles.changeImageText}>Change Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.photoButton} onPress={showImagePickerOptions}>
              <Text style={styles.photoIcon}>📷</Text>
              <Text style={styles.photoText}>Add an image</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
        <Text style={styles.finishButtonText}>Finish</Text>
      </TouchableOpacity>

      <MapModal
        visible={showMap}
        onClose={() => setShowMap(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={coordinates}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    fontSize: 24,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  picker: {
    height: 50,
  },
  severityContainer: {
    flexDirection: "row",
    gap: 10,
  },
  severityButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
  },
  severityButtonSelected: {
    borderColor: "transparent",
  },
  lowSelected: {
    backgroundColor: "#4CAF50",
  },
  mediumSelected: {
    backgroundColor: "#FF9800",
  },
  highSelected: {
    backgroundColor: "#F44336",
  },
  severityButtonText: {
    fontSize: 14,
    color: "#666",
  },
  severityButtonTextSelected: {
    color: "white",
    fontWeight: "500",
  },
  locationContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  locationInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  placeholder: {
    color: "#999",
  },
  mapIcon: {
    fontSize: 18,
  },
  coordinatesText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontFamily: "monospace",
  },
  photoButton: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  photoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  photoText: {
    fontSize: 14,
    color: "#666",
  },
  finishButton: {
    backgroundColor: "#333",
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  finishButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  changeImageButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  changeImageText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  removeImageButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  removeImageText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  locationIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clearLocationButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  clearLocationIcon: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 12,
  },
  accuracyText: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
    fontFamily: "monospace",
  },
  // Add the reports button style
  reportsButton: {
    fontSize: 20,
    color: "#007AFF",
    padding: 5,
  },
})

export default ReportRoadIssue
