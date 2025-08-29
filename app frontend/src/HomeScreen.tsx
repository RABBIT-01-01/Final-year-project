"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import URL from "../config"

export default function HomeScreen({ navigation, route }) {
  const { maintenanceTeam } = route.params || {}
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
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

    if (maintenanceTeam) {
      fetchReports()
    }
  }, [maintenanceTeam])

  const getSeverityColor = (level) => {
    switch (level) {
      case "High":
        return "#ea580c"
      case "Medium":
        return "#d97706"
      case "Low":
        return "#16a34a"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#dc2626"
      case "verified":
        return "#d97706"
      case "solved":
        return "#16a34a"
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textcolor}>Welcome, {maintenanceTeam} Team</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Reports</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("UserProfile")}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.reportsList}>
          {reports.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#6b7280" }}>
              No reports found for {maintenanceTeam}
            </Text>
          ) : (
            reports.map((report) => (
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
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{report.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  {report.reportedBy && (
                    <View style={styles.detailRow}>
                      <Ionicons name="person-outline" size={16} color="#6b7280" />
                      <Text style={styles.detailText}>{report.reportedBy.fullname}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.reportActions}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                    <Text style={styles.statusText}>{report.status}</Text>
                  </View>
                </View>
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  textcolor: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  addButton: { backgroundColor: "#2563eb", padding: 8, borderRadius: 8 },
  reportsList: { flex: 1 },
  reportCard: { backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  reportHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  reportType: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  priorityText: { color: "#fff", fontWeight: "bold" },
  reportDescription: { color: "#374151", marginBottom: 12 },
  reportDetails: { marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  detailText: { marginLeft: 4, color: "#6b7280" },
  reportActions: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: "#fff", fontWeight: "bold" },
})
