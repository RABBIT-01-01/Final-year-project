"use client"

import { useState, useCallback } from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { getReports } from "./ReportStorage"
import MapAll from "../MapAll"

const { width } = Dimensions.get("window")

const HomeScreen = ({ navigation }) => {
  const [showMap, setShowMap] = useState(false)
  const [reportsCount, setReportsCount] = useState(0)
  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState(null)


  const handleLocationSelect = (selectedLocation, coords) => {
    setLocation(selectedLocation)
    setCoordinates(coords)
    setShowMap(false)
  }

  const loadReportsData = async () => {
    try {
      const reports = await getReports()
      setReportsCount(reports.length)
    } catch (error) {
      console.error("Error loading reports:", error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadReportsData()
    }, []),
  )

  const MenuCard = ({ title, subtitle, icon, onPress, color = "#007AFF" }) => (
    <TouchableOpacity style={[styles.menuCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.menuCardContent}>
        <View style={styles.menuCardLeft}>
          <Text style={styles.menuCardIcon}>{icon}</Text>
          <View style={styles.menuCardText}>
            <Text style={styles.menuCardTitle}>{title}</Text>
            <Text style={styles.menuCardSubtitle}>{subtitle}</Text>
          </View>
        </View>
        <Text style={styles.menuCardArrow}>›</Text>
      </View>
    </TouchableOpacity>
  )

  const QuickStatsCard = ({ title, value, icon, color = "#007AFF" }) => (
    <View style={[styles.statsCard, { backgroundColor: color }]}>
      <Text style={styles.statsIcon}>{icon}</Text>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.appTitle}>Sadak360</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate("UserProfile")}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <QuickStatsCard title="Total Reports" value={reportsCount} icon="📊" color="#007AFF" />
          {/* <QuickStatsCard title="This Month" value={0} icon="📅" color="#4CAF50" /> */}
          <QuickStatsCard title="High Priority" value={0} icon="⚠️" color="#F44336" />
        </View>

        {/* Main Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <MenuCard
            title="Report a Road Issue"
            subtitle="Submit a new road problem report"
            icon="🚧"
            color="#FF6B35"
            onPress={() => navigation.navigate("ReportRoadIssue")}
          />
          <MenuCard
            title="View Previous Reports"
            subtitle={`${reportsCount} report${reportsCount !== 1 ? "s" : ""} submitted`}
            icon="📋"
            color="#007AFF"
            onPress={() => navigation.navigate("PreviousReports")}
          />
          <MenuCard
            title="User Profile"
            subtitle="Manage your account and settings"
            icon="👤"
            color="#8E44AD"
            onPress={() => navigation.navigate("UserProfile")}
          />
          <MenuCard
            title="view all reports on map"
            subtitle="reported by all users"
            icon="📅"
            color="#8E44AD"
            onPress={() => setShowMap(true)}
          />
        </View>

        {/* <View style={styles.section}>
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
                </View> */}

        {/* Quick Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>Take clear photos of the road issue for better reporting</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>📍</Text>
              <Text style={styles.tipText}>Use GPS location for accurate positioning</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>📝</Text>
              <Text style={styles.tipText}>Provide detailed descriptions to help authorities</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
      <MapAll
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
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: "white",
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  profileButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  profileIcon: {
    fontSize: 24,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    minHeight: 100,
    justifyContent: "center",
  },
  statsIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  menuCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  menuCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuCardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  menuCardText: {
    flex: 1,
  },
  menuCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  menuCardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  menuCardArrow: {
    fontSize: 24,
    color: "#ccc",
    fontWeight: "300",
  },
  tipsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
})

export default HomeScreen
