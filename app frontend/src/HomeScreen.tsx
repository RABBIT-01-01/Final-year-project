"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import * as ImagePicker from "expo-image-picker"
import URL from "../config"

export default function HomeScreen({ navigation, route }) {
  const { maintenanceTeam } = route.params || {}
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showFilters, setShowFilters] = useState(true)

  // filter state
  const [filter, setFilter] = useState({ status: "", issueType: "", severityLevel: "" })

  // state to track which report is being resolved
  const [resolvingReportId, setResolvingReportId] = useState(null)
  const [resolveDescription, setResolveDescription] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)

  // Fetch reports function
  const fetchReports = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://${URL}:4000/api/requests/team/${maintenanceTeam}`)
      const data = await response.json()
      setReports(data)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (maintenanceTeam) fetchReports()
  }, [maintenanceTeam])

  const getSeverityColor = (level) => {
    switch (level) {
      case "High": return "#ea580c"
      case "Medium": return "#d97706"
      case "Low": return "#16a34a"
      default: return "#6b7280"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#dc2626"
      case "verified": return "#d97706"
      case "solved": return "#16a34a"
      default: return "#6b7280"
    }
  }

  const filteredReports = reports.filter((report) => {
    return (
      (!filter.status || report.status === filter.status) &&
      (!filter.issueType || report.issueType === filter.issueType) &&
      (!filter.severityLevel || report.severityLevel === filter.severityLevel)
    )
  })

  const issueTypes = [...new Set(reports.map((r) => r.issueType))]

  // Image picker permissions
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
      if (!result.canceled && result.assets[0]) setSelectedImage(result.assets[0])
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
      if (!result.canceled && result.assets[0]) setSelectedImage(result.assets[0])
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

  const handleResolve = async (reportId) => {
    if (!resolveDescription.trim()) {
      Alert.alert("Validation Error", "Please enter a resolution description")
      return
    }
    const formData = new FormData()
    formData.append("description", resolveDescription)
    formData.append("status", "solved")
    if (selectedImage) {
      const uriParts = selectedImage.uri.split(".")
      const fileType = uriParts[uriParts.length - 1]
      formData.append("image", { uri: selectedImage.uri, name: `photo.${fileType}`, type: `image/${fileType}` } as any)
    }

    try {
      const response = await fetch(`http://${URL}:4000/api/requests/${reportId}`, { method: "PUT", body: formData })
      if (!response.ok) throw new Error("Failed to resolve report")
      setResolveDescription("")
      setSelectedImage(null)
      setResolvingReportId(null)
      Alert.alert("Success", "Report marked as resolved!")
      fetchReports()
    } catch (error) {
      console.error("Error resolving report:", error)
      Alert.alert("Error", "Failed to resolve report. Please try again.")
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.textcolor}>Welcome, {maintenanceTeam} Team</Text>
      </View>

      {/* Dropdown Filters */}
      <TouchableOpacity style={[styles.resolveButton, { marginBottom: 8 }]} onPress={() => setShowFilters(prev => !prev)}>
        <Text style={styles.resolveButtonText}>{showFilters ? "Hide Filters" : "Show Filters"}</Text>
      </TouchableOpacity>
      {showFilters && (
        <View style={styles.filterContainer}>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={filter.status} onValueChange={(val) => setFilter((prev) => ({ ...prev, status: val }))}>
              <Picker.Item label="All Status" value="" />
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="Verified" value="verified" />
              <Picker.Item label="Solved" value="solved" />
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={filter.severityLevel} onValueChange={(val) => setFilter((prev) => ({ ...prev, severityLevel: val }))}>
              <Picker.Item label="All severity level" value="" />
              <Picker.Item label="High" value="High" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="Low" value="Low" />
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={filter.issueType} onValueChange={(val) => setFilter((prev) => ({ ...prev, issueType: val }))}>
              <Picker.Item label="All issue type" value="" />
              {issueTypes.map((type, index) => <Picker.Item key={`issue-${index}`} label={type} value={type} />)}
            </Picker>
          </View>
        </View>
      )}

      {/* Reports Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Reports</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("maintanancevalid")}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Reports List with Pull-to-Refresh */}
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          style={styles.reportsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true)
                await fetchReports()
                setRefreshing(false)
              }}
            />
          }
        >
          {filteredReports.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#6b7280" }}>
              No reports found for {maintenanceTeam}
            </Text>
          ) : (
            filteredReports.map((report) => (
              <View key={report._id} style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <Text style={styles.reportType}>{report.issueType}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getSeverityColor(report.severityLevel) }]}>
                    <Text style={styles.priorityText}>{report.severityLevel}</Text>
                  </View>
                </View>
                <Text style={styles.reportDescription}>{report.description}</Text>
                {report.image && (
                  <Image source={{ uri: `http://${URL}:4000/api${report.image}` }} style={{ width: "100%", height: 200, borderRadius: 8, marginBottom: 8 }} />
                )}
                <View style={styles.reportDetails}>
                  <View style={styles.detailRow}><Ionicons name="location-outline" size={16} color="#6b7280" /><Text style={styles.detailText}>{report.location}</Text></View>
                  <View style={styles.detailRow}><Ionicons name="calendar-outline" size={16} color="#6b7280" /><Text style={styles.detailText}>{new Date(report.createdAt).toLocaleDateString()}</Text></View>
                  {report.reportedBy && <View style={styles.detailRow}><Ionicons name="person-outline" size={16} color="#6b7280" /><Text style={styles.detailText}>{report.reportedBy.fullname}</Text></View>}
                </View>

                <View style={styles.reportActions}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                    <Text style={styles.statusText}>{report.status}</Text>
                  </View>

                  {report.status === "pending" && resolvingReportId !== report._id && (
                    <TouchableOpacity style={styles.resolveButton} onPress={() => setResolvingReportId(report._id)}>
                      <Text style={styles.resolveButtonText}>Road Resolved</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {resolvingReportId === report._id && (
                  <View style={styles.resolveContainer}>
                    <TextInput style={styles.textInput} placeholder="Enter resolution description" value={resolveDescription} onChangeText={setResolveDescription} />
                    <View style={styles.section}>
                      <Text style={styles.label}>Attach Photo</Text>
                      {selectedImage ? (
                        <View style={styles.imageContainer}>
                          <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                          <View style={styles.imageActions}>
                            <TouchableOpacity style={styles.changeImageButton} onPress={showImagePickerOptions}><Text style={styles.changeImageText}>Change Photo</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}><Text style={styles.removeImageText}>Remove</Text></TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity style={styles.photoButton} onPress={showImagePickerOptions}><Text style={styles.photoIcon}>📷</Text><Text style={styles.photoText}>Add an image</Text></TouchableOpacity>
                      )}
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={() => handleResolve(report._id)}><Text style={styles.submitButtonText}>Submit</Text></TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  )
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  textcolor: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  headerTitle: { fontSize: 15, fontWeight: "bold", color: "#111827" },
  addButton: { backgroundColor: "#2563eb", padding: 8, borderRadius: 8 },
  reportsList: { flex: 1 },

  // Filters
  filterContainer: { marginBottom: 5 },
  pickerWrapper: { backgroundColor: "#fff", borderRadius: 3, paddingVertical: 2, paddingHorizontal: 4, marginBottom: 2 },

  // Report Cards
  reportCard: { backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  reportHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  reportType: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  priorityText: { color: "#fff", fontWeight: "bold" },
  reportDescription: { color: "#374151", marginBottom: 12 },
  reportDetails: { marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  detailText: { marginLeft: 4, color: "#6b7280" },
  reportActions: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: "#fff", fontWeight: "bold" },

  resolveButton: { backgroundColor: "#2563eb", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, marginLeft: 8 },
  resolveButtonText: { color: "#fff", fontWeight: "bold" },

  resolveContainer: { marginTop: 8 },
  textInput: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 6, padding: 8, marginBottom: 6 },
  submitButton: { backgroundColor: "#16a34a", padding: 10, borderRadius: 6, alignItems: "center" },
  submitButtonText: { color: "#fff", fontWeight: "bold" },

  photoButton: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  photoIcon: { fontSize: 24, marginBottom: 8 },
  photoText: { fontSize: 14, color: "#666" },
  imageContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedImage: { width: "100%", height: 200, borderRadius: 8, marginBottom: 10 },
  imageActions: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  changeImageButton: { flex: 1, backgroundColor: "#007AFF", paddingVertical: 8, borderRadius: 6, alignItems: "center" },
  changeImageText: { color: "white", fontSize: 14, fontWeight: "500" },
  removeImageButton: { flex: 1, backgroundColor: "#FF3B30", paddingVertical: 8, borderRadius: 6, alignItems: "center" },
  removeImageText: { color: "white", fontSize: 14, fontWeight: "500" },
  section: { marginTop: 20 },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8, color: "#333" },
})
