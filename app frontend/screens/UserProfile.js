"use client"

import { useState, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { CommonActions } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
// import Cookies from '@react-native-community/cookies';
import { getReports, clearAllReports } from "./ReportStorage"
import URL from "../config"

// const USER_PROFILE_KEY = "@user_profile"
const API_URL = `http://${URL}:4000/api/users/profile`

const UserProfile = ({ navigation }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    notifications: true,
    locationSharing: true,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [reportsCount, setReportsCount] = useState(0)

  const loadProfile = async () => {
    try {
    //   const profileData = await AsyncStorage.getItem(USER_PROFILE_KEY)
    //   if (profileData) {
    //     setProfile(JSON.parse(profileData))
    //   }

    //   // Load reports count
    //   const reports = await getReports()
    //   setReportsCount(reports.length)
    // } catch (error) {
    //   console.error("Error loading profile:", error)
    // }


     // Fetch user profile from API
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error("Failed to fetch profile")
      const data = await response.json()
    // alert("Response: " + JSON.stringify(data))
      setProfile(prev => ({
        ...prev,
        name: data.fullname,
        email: data.email,
        phone: data.phone,
      }))

      // Load reports count
      const reports = await getReports()
      setReportsCount(reports.length)
    } catch (error) {
      console.error("Error loading profile:", error)
      Alert.alert("Error", "Unable to load profile data.")
    }
  }

  const saveProfile = async () => {
    try {
    //   await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile))
    //   setIsEditing(false)
    //   Alert.alert("Success", "Profile updated successfully!")
    // } catch (error) {
    //   Alert.alert("Error", "Failed to save profile")
    // }

     // Send updated profile to API
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: profile.fullname,
          email: profile.email,
          phone: profile.phone,
        }),
      })
      if (!response.ok) throw new Error("Failed to update profile")

      setIsEditing(false)
      Alert.alert("Success", "Profile updated successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      Alert.alert("Error", "Failed to save profile")
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
            // await Cookies.clearAll();
          
            // Reset navigation stack to login screen
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

  const handleClearAllData = () => {
    Alert.alert("Clear All Data", "This will delete all your reports and profile data. This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: async () => {
          try {
            await clearAllReports()
            // await AsyncStorage.removeItem(USER_PROFILE_KEY)
            setProfile({
              name: "",
              email: "",
              phone: "",
              notifications: true,
              locationSharing: true,
            })
            setReportsCount(0)
            Alert.alert("Success", "All data cleared successfully")
          } catch (error) {
            Alert.alert("Error", "Failed to clear data")
          }
        },
      },
    ])
  }

  useFocusEffect(
    useCallback(() => {
      loadProfile()
    }, []),
  )

  const ProfileField = ({ label, value, onChangeText, placeholder, keyboardType = "default" }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || "Not set"}</Text>
      )}
    </View>
  )

  const SettingItem = ({ label, value, onValueChange, description }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  )

  const StatItem = ({ label, value, icon }) => (
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>{icon}</Text>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity> */}
        {/* <Text style={styles.headerTitle}>User Profile</Text> */}
        <TouchableOpacity onPress={isEditing ? saveProfile : () => setIsEditing(true)}>
          <Text style={styles.editButton}>{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name ? profile.name.charAt(0).toUpperCase() : "👤"}</Text>
          </View>
          <Text style={styles.profileName}>{profile.name || "User Name"}</Text>
          <Text style={styles.profileEmail}>{profile.email || "user@example.com"}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsContainer}>
            <StatItem label="Total Reports" value={reportsCount} icon="📊" />
            <StatItem label="This Month" value="0" icon="📅" />
            <StatItem label="Resolved" value="0" icon="✅" />
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <ProfileField
              label="Full Name"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Enter your full name"
            />
            <ProfileField
              label="Email Address"
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
            <ProfileField
              label="Phone Number"
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <SettingItem
              label="Push Notifications"
              value={profile.notifications}
              onValueChange={(value) => setProfile({ ...profile, notifications: value })}
              description="Receive updates about your reports"
            />
            <SettingItem
              label="Location Sharing"
              value={profile.locationSharing}
              onValueChange={(value) => setProfile({ ...profile, locationSharing: value })}
              description="Allow app to access your location"
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("PreviousReports")}>
            <Text style={styles.actionButtonIcon}>📋</Text>
            <Text style={styles.actionButtonText}>View All Reports</Text>
            <Text style={styles.actionButtonArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("ReportRoadIssue")}>
            <Text style={styles.actionButtonIcon}>🚧</Text>
            <Text style={styles.actionButtonText}>Create New Report</Text>
            <Text style={styles.actionButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Account Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={handleClearAllData}>
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  editButton: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "white",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: "white",
    fontWeight: "600",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
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
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statContent: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
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
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  actionButtonArrow: {
    fontSize: 20,
    color: "#ccc",
  },
  logoutButton: {
    backgroundColor: "#FF9500",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 20,
  },
})

export default UserProfile
