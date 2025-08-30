"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { CommonActions } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import URL from "../config"

interface UserProfile {
  name: string
  email: string
  phone: string
  team: string
}

interface UserStats {
  reportsCompleted: number
  currentAssignments: number
}

export default function ProfileScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    team: "",
  })

  const [stats, setStats] = useState<UserStats>({
    reportsCompleted: 0,
    currentAssignments: 0,
  })

  // Fetch profile & stats function (can be reused for refresh)
  const fetchProfileAndStats = async () => {
    setLoading(true)
    try {
      // Fetch profile
      const resProfile = await fetch(`http://${URL}:4000/api/users/profile`)
      const dataProfile = await resProfile.json()

      const userProfile: UserProfile = {
        name: dataProfile.fullname,
        email: dataProfile.email,
        phone: dataProfile.phone,
        team: dataProfile.maintenance_team,
      }
      setProfile(userProfile)

      // Fetch stats using maintenance team
      if (userProfile.team) {
        const resStats = await fetch(`http://${URL}:4000/api/requests/team/${userProfile.team}`)
        const requests = await resStats.json()

        setStats({
          reportsCompleted: requests.filter((r: any) => r.status === "solved").length,
          currentAssignments: requests.filter((r: any) => r.status === "pending").length,
        })
      }
    } catch (error) {
      console.error("Error fetching profile/stats:", error)
      Alert.alert("Error", "Failed to load profile & stats")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfileAndStats()
  }, [])

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`http://${URL}:4000/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (!response.ok) throw new Error("Failed to update profile")

      await fetchProfileAndStats()
      setIsEditing(false)
      Alert.alert("Success", "Profile updated successfully")
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Failed to update profile")
    }
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("@user_token")
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }],
              }),
            )
          } catch (error) {
            Alert.alert("Error", "Failed to logout")
          }
        },
      },
    ])
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true)
            await fetchProfileAndStats()
            setRefreshing(false)
          }}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://placeholder.svg?height=100&width=100&query=professional+avatar" }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userTeam}>{profile.team}</Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
          <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Performance Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.reportsCompleted}</Text>
            <Text style={styles.statLabel}>Reports Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.currentAssignments}</Text>
            <Text style={styles.statLabel}>Current Assignments</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileContainer}>
        <Text style={styles.sectionTitle}>Profile Information</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
          ) : (
            <Text style={styles.fieldValue}>{profile.name}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.fieldValue}>{profile.email}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Phone</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.fieldValue}>{profile.phone}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Team</Text>
          <Text style={styles.fieldValue}>{profile.team}</Text>
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionsContainer}>

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { backgroundColor: "#ffffff", padding: 20, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  avatarContainer: { position: "relative" },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#e5e7eb" },
  cameraButton: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#2563eb", width: 28, height: 28, borderRadius: 14, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#ffffff" },
  headerInfo: { flex: 1, marginLeft: 16 },
  userName: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  userTeam: { fontSize: 14, color: "#2563eb", marginTop: 2, fontWeight: "500" },
  editButton: { padding: 8 },
  statsContainer: { backgroundColor: "#ffffff", margin: 16, borderRadius: 12, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 16 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: { flex: 1, minWidth: "45%", backgroundColor: "#f9fafb", borderRadius: 8, padding: 16, alignItems: "center" },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "#2563eb" },
  statLabel: { fontSize: 12, color: "#6b7280", textAlign: "center", marginTop: 4 },
  profileContainer: { backgroundColor: "#ffffff", margin: 16, borderRadius: 12, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  fieldContainer: { marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 4 },
  fieldValue: { fontSize: 16, color: "#111827" },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#ffffff" },
  saveButton: { backgroundColor: "#2563eb", borderRadius: 8, padding: 16, alignItems: "center", marginTop: 8 },
  saveButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  actionsContainer: { backgroundColor: "#ffffff", margin: 16, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  actionButton: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  actionButtonText: { flex: 1, fontSize: 16, color: "#374151", marginLeft: 12 },
  logoutButton: { borderBottomWidth: 0 },
  logoutText: { color: "#dc2626" },
})
