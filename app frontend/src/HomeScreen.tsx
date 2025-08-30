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

  const [filter, setFilter] = useState({ status: "", issueType: "", severityLevel: "" })
  const [resolvingReportId, setResolvingReportId] = useState(null)
  const [resolveDescription, setResolveDescription] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)

  const fetchReports = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://${URL}:4000/api/requests/team/${maintenanceTeam}`)
      const data = await response.json()
      setReports(data)
    } catch (error) {
      console.error("Error fetching reports:", error)
      Alert.alert("Error", "Failed to fetch reports")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (maintenanceTeam) fetchReports()
  }, [maintenanceTeam])

  const getSeverityColor = (level) => {
    switch (level) {
      case "High": return "#ef4444"
      case "Medium": return "#f59e0b"
      case "Low": return "#10b981"
      default: return "#9ca3af"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#ef4444"
      case "verified": return "#f59e0b"
      case "solved": return "#10b981"
      default: return "#9ca3af"
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

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert("Permission Required", "Camera and photo library access are required.")
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
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 })
    if (!result.canceled && result.assets[0]) setSelectedImage(result.assets[0])
  }

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 })
    if (!result.canceled && result.assets[0]) setSelectedImage(result.assets[0])
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
        <Text style={styles.welcomeText}>Hello, <Text style={{ fontWeight: "bold" }}>{maintenanceTeam} Team</Text></Text>
      </View>

      {/* Filters */}
      <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(prev => !prev)}>
        <Text style={styles.filterToggleText}>{showFilters ? "Hide Filters" : "Show Filters"}</Text>
      </TouchableOpacity>
      {showFilters && (
        <View style={styles.filterContainer}>
          <Picker selectedValue={filter.status} onValueChange={(val) => setFilter((prev) => ({ ...prev, status: val }))} style={styles.picker}>
            <Picker.Item label="All Status" value="" />
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Verified" value="verified" />
            <Picker.Item label="Solved" value="solved" />
          </Picker>
          <Picker selectedValue={filter.severityLevel} onValueChange={(val) => setFilter((prev) => ({ ...prev, severityLevel: val }))} style={styles.picker}>
            <Picker.Item label="All Severity" value="" />
            <Picker.Item label="High" value="High" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Low" value="Low" />
          </Picker>
          <Picker selectedValue={filter.issueType} onValueChange={(val) => setFilter((prev) => ({ ...prev, issueType: val }))} style={styles.picker}>
            <Picker.Item label="All Issue Types" value="" />
            {issueTypes.map((type, index) => <Picker.Item key={index} label={type} value={type} />)}
          </Picker>
        </View>
      )}

      {/* Reports Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Reports</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("maintanancevalid")}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Reports List */}
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await fetchReports(); setRefreshing(false); }} />
          }
        >
          {filteredReports.length === 0 ? (
            <Text style={styles.noReportsText}>No reports found for {maintenanceTeam}</Text>
          ) : (
            filteredReports.map((report) => (
              <View key={report._id} style={styles.reportCard}>
                {/* Header */}
                <View style={styles.reportHeader}>
                  <Text style={styles.reportType}>{report.issueType}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getSeverityColor(report.severityLevel) }]}>
                    <Text style={styles.priorityText}>{report.severityLevel}</Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.reportDescription}>{report.description}</Text>

                {/* Image */}
                {report.image && (
                  <Image source={{ uri: `http://${URL}:4000/api${report.image}` }} style={styles.reportImage} />
                )}

                {/* Details */}
                <View style={styles.reportDetails}>
                  <View style={styles.detailRow}><Ionicons name="location-outline" size={16} color="#6b7280" /><Text style={styles.detailText}>{report.location}</Text></View>
                  <View style={styles.detailRow}><Ionicons name="calendar-outline" size={16} color="#6b7280" /><Text style={styles.detailText}>{new Date(report.createdAt).toLocaleDateString()}</Text></View>
                  {report.reportedBy && <View style={styles.detailRow}><Ionicons name="person-outline" size={16} color="#6b7280" /><Text style={styles.detailText}>{report.reportedBy.fullname}</Text></View>}
                </View>

                {/* Actions */}
                <View style={styles.reportActions}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                    <Text style={styles.statusText}>{report.status}</Text>
                  </View>
                  {report.status === "pending" && resolvingReportId !== report._id && (
                    <TouchableOpacity style={styles.resolveButton} onPress={() => setResolvingReportId(report._id)}>
                      <Text style={styles.resolveButtonText}>Resolve</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Resolution Form */}
                {resolvingReportId === report._id && (
                  <View style={styles.resolveContainer}>
                    <TextInput style={styles.textInput} placeholder="Enter resolution description" value={resolveDescription} onChangeText={setResolveDescription} />
                    <View style={styles.section}>
                      <Text style={styles.label}>Attach Photo</Text>
                      {selectedImage ? (
                        <View style={styles.imageContainer}>
                          <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                          <View style={styles.imageActions}>
                            <TouchableOpacity style={styles.changeImageButton} onPress={showImagePickerOptions}><Text style={styles.changeImageText}>Change</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}><Text style={styles.removeImageText}>Remove</Text></TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity style={styles.photoButton} onPress={showImagePickerOptions}>
                          <Text style={styles.photoIcon}>📷</Text>
                          <Text style={styles.photoText}>Add an image</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={() => handleResolve(report._id)}>
                      <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: "#f3f4f6", paddingHorizontal: 12, paddingTop: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  welcomeText: { fontSize: 18, color: "#111827" },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  addButton: { backgroundColor: "#2563eb", padding: 8, borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },

  filterToggle: { backgroundColor: "#2563eb", borderRadius: 6, padding: 10, marginBottom: 8, alignItems: "center" },
  filterToggleText: { color: "#fff", fontWeight: "bold" },
  filterContainer: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  picker: { marginBottom: 8, backgroundColor: "#f9fafb", borderRadius: 6 },

  reportCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  reportHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  reportType: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priorityText: { color: "#fff", fontWeight: "bold" },
  reportDescription: { color: "#374151", marginBottom: 12 },
  reportImage: { width: "100%", height: 220, borderRadius: 10, marginBottom: 12 },
  reportDetails: { marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  detailText: { marginLeft: 6, color: "#6b7280" },

  reportActions: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: "#fff", fontWeight: "bold" },
  resolveButton: { backgroundColor: "#2563eb", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  resolveButtonText: { color: "#fff", fontWeight: "bold" },

  resolveContainer: { marginTop: 12 },
  textInput: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: "#f9fafb" },
  submitButton: { backgroundColor: "#10b981", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 8 },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  photoButton: { backgroundColor: "#f3f4f6", borderRadius: 8, paddingVertical: 30, alignItems: "center", borderWidth: 1, borderColor: "#e5e7eb", borderStyle: "dashed", marginBottom: 10 },
  photoIcon: { fontSize: 24, marginBottom: 6 },
  photoText: { fontSize: 14, color: "#6b7280" },
  imageContainer: { backgroundColor: "#f9fafb", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 10 },
  selectedImage: { width: "100%", height: 200, borderRadius: 8, marginBottom: 10 },
  imageActions: { flexDirection: "row", justifyContent: "space-between" },
  changeImageButton: { flex: 1, backgroundColor: "#3b82f6", paddingVertical: 8, borderRadius: 6, alignItems: "center", marginRight: 5 },
  changeImageText: { color: "#fff", fontWeight: "500" },
  removeImageButton: { flex: 1, backgroundColor: "#ef4444", paddingVertical: 8, borderRadius: 6, alignItems: "center", marginLeft: 5 },
  removeImageText: { color: "#fff", fontWeight: "500" },
  section: { marginTop: 12 },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8, color: "#374151" },
  noReportsText: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#9ca3af" },
})
