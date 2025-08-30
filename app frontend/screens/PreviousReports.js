"use client"


import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import URL from "../config"

const PreviousReports = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);


  const getUserId = async () => {
    try {
      const response = await fetch(`http://${URL}:4000/api/users/profile`);
      if (!response.ok) throw new Error("Failed to fetch user profile");
      const userData = await response.json();
      return userData._id;
    } catch (error) {
      Alert.alert("Error", "Failed to get user profile");
      throw error;
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);

      // Get user ID first
      let id = userId;
      if (!id) {
        id = await getUserId();
        setUserId(id);
      }

      // Fetch reports for this user
      const response = await fetch(`http://${URL}:4000/api/requests/${id}`);
      if (!response.ok) throw new Error("Failed to fetch reports");

      const fetchedReports = await response.json();
      console.log("Fetched reports:", fetchedReports);
      setReports(fetchedReports);
    } catch (error) {
      Alert.alert("Error", "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const handleClearAllReports = () => {
    if (reports.length === 0) return;

    Alert.alert(
      "Clear All Reports",
      "Are you sure you want to delete all reports? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `http://${URL}:4000/api/requests/clear-all/${userId}`,
                { method: "DELETE" }
              );
              if (!response.ok) throw new Error("Failed to clear all reports");
              setReports([]);
              Alert.alert("Success", "All reports cleared successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to clear reports");
            }
          },
        },
      ]
    );
  };

  const handleDeleteReport = (reportId, title) => {
    Alert.alert("Delete Report", `Are you sure you want to delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(
              `http://${URL}:4000/api/requests/${reportId}`,
              { method: "DELETE" }
            );
            if (!response.ok) throw new Error("Failed to delete report");
            await loadReports();
            Alert.alert("Success", "Report deleted successfully");
          } catch (error) {
            Alert.alert("Error", "Failed to delete report");
          }
        },
      },
    ]);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "#F44336";
      case "Medium":
        return "#FF9800";
      case "Low":
        return "#4CAF50";
      default:
        return "#666";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "solved":
        return "#007AFF";
      case "pending":
        return "#FF9800";
      case "verified":
        return "#4CAF50";
      default:
        return "#666";
    }
  };

  const ReportCard = ({ report }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.reportTitleContainer}>
          <Text style={styles.reportTitle} numberOfLines={1}>
            {report.title}
          </Text>
          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.severityBadge,
                { backgroundColor: getSeverityColor(report.severityLevel) },
              ]}
            >
              <Text style={styles.badgeText}>{report.severityLevel}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(report.status) },
              ]}
            >
              <Text style={styles.badgeText}>{report.status}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteReport(report._id, report.title)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.reportType}>{report.issueType}</Text>
        
      <Text style={styles.reportDescription} numberOfLines={2}>
        {report.description}
      </Text>

      <View style={styles.locationContainer}>
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.locationText} numberOfLines={1}>
          {report.location}
        </Text>
      </View>

      {report.coordinates && (
        <Text style={styles.coordinatesText}>
          {report.coordinates.latitude},{" "}
          {report.coordinates.longitude}
        </Text>
      )}

      {report.image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `http://${URL}:4000/api${report.image}` }}
            style={styles.reportImage}
          />
        </View>
      )}

      <Text style={styles.timestamp}>{formatDate(report.updatedAt)}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Previous Reports</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Previous Reports</Text>
        <TouchableOpacity
          onPress={handleClearAllReports}
          disabled={reports.length === 0}
        >
          <Text
            style={[
              styles.clearAllButton,
              reports.length === 0 && styles.clearAllButtonDisabled,
            ]}
          >
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Reports Yet</Text>
          <Text style={styles.emptyDescription}>
            Your submitted road issue reports will appear here. Start by
            creating your first report!
          </Text>
          <TouchableOpacity
            style={styles.createReportButton}
            onPress={() => navigation.navigate("ReportRoadIssue")}
          >
            <Text style={styles.createReportButtonText}>
              Create First Report
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {reports.length} report{reports.length !== 1 ? "s" : ""} submitted
            </Text>
          </View>

          {reports.map((report) => (
            <ReportCard key={report._id} report={report} />
          ))}

          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    fontSize: 24,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 60,
  },
  clearAllButton: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "500",
  },
  clearAllButtonDisabled: {
    color: "#ccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    paddingVertical: 15,
    alignItems: "center",
  },
  statsText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  reportCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reportTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 6,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 15,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 14,
  },
  reportType: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    marginBottom: 6,
  },
  reportDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  coordinatesText: {
    fontSize: 12,
    color: "#888",
    fontFamily: "monospace",
    marginBottom: 12,
  },
  imageContainer: {
    marginBottom: 12,
  },
  reportImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  createReportButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createReportButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 20,
  },
})

export default PreviousReports
