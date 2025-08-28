// "use client"

// import { useState } from "react"
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from "react-native"
// import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
// import URL from "../config"
// import MapAll from "../MapAll"

// const { width } = Dimensions.get("window")
// const API_URL = `http://${URL}:4000/api/users/profile`

// const MaintenanceHomeScreen = () => {
//   const [showMap, setShowMap] = useState(false)
//   const [location, setLocation] = useState("")
//   const [coordinates, setCoordinates] = useState(null)
//   const [reports, setReports] = useState([
//     { id: 1, title: "Pothole on Main St", priority: "High", status: "Pending", type: "pothole" },
//     { id: 2, title: "Broken street light", priority: "Medium", status: "In Progress", type: "light" },
//     { id: 3, title: "Fallen tree blocking road", priority: "High", status: "Pending", type: "tree" },
//     { id: 4, title: "Waterlogging near bridge", priority: "Low", status: "Resolved", type: "water" },
//   ])

//   const totalReports = reports.length
//   const pendingReports = reports.filter((r) => r.status === "Pending").length
//   const resolvedReports = reports.filter((r) => r.status === "Resolved").length

//   const handleLocationSelect = (selectedLocation, coords) => {
//     setLocation(selectedLocation)
//     setCoordinates(coords)
//     setShowMap(false)
//   }

//   const getReportIcon = (type) => {
//     switch (type) {
//       case "pothole":
//         return <MaterialIcons name="build" size={20} color="#6366f1" />
//       case "light":
//         return <Ionicons name="bulb" size={20} color="#f59e0b" />
//       case "tree":
//         return <FontAwesome5 name="tree" size={20} color="#10b981" />
//       case "water":
//         return <Ionicons name="water" size={20} color="#3b82f6" />
//       default:
//         return <Ionicons name="alert-circle" size={20} color="#ef4444" />
//     }
//   }

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "High":
//         return "#ef4444"
//       case "Medium":
//         return "#f59e0b"
//       case "Low":
//         return "#10b981"
//       default:
//         return "#6b7280"
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "#ef4444"
//       case "In Progress":
//         return "#f59e0b"
//       case "Resolved":
//         return "#10b981"
//       default:
//         return "#6b7280"
//     }
//   }

//   const ReportCard = ({ report }) => (
//     <TouchableOpacity style={styles.reportCard}>
//       <View style={styles.reportHeader}>
//         <View style={styles.reportIconContainer}>{getReportIcon(report.type)}</View>
//         <View style={styles.reportContent}>
//           <Text style={styles.reportTitle}>{report.title}</Text>
//           <View style={styles.badgeContainer}>
//             <View style={[styles.badge, { backgroundColor: getPriorityColor(report.priority) }]}>
//               <Text style={styles.badgeText}>{report.priority}</Text>
//             </View>
//             <View style={[styles.badge, { backgroundColor: getStatusColor(report.status) }]}>
//               <Text style={styles.badgeText}>{report.status}</Text>
//             </View>
//           </View>
//         </View>
//         <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
//       </View>
//     </TouchableOpacity>
//   )

//   const handleLogout = () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Logout", style: "destructive", onPress: () => console.log("Logging out...") },
//     ])
//   }

//   const handleFloatingButtonPress = () => {
//     Alert.alert("Quick Actions", "Choose an action:", [
//       { text: "Add New Report", onPress: () => Alert.alert("Navigate to Add Report") },
//       { text: "Emergency Alert", onPress: () => Alert.alert("Emergency Alert Sent") },
//       { text: "View Map", onPress: () => setShowMap(true) },
//       { text: "Cancel", style: "cancel" },
//     ])
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.headerLeft}>
//             <View style={styles.headerIconContainer}>
//               <MaterialIcons name="build" size={24} color="#6366f1" />
//             </View>
//             <View>
//               <Text style={styles.welcomeText}>Welcome, Maintenance Team!</Text>
//               <Text style={styles.headerTitle}>Sadak360 Dashboard</Text>
//             </View>
//           </View>
//           <TouchableOpacity style={styles.notificationButton}>
//             <Ionicons name="notifications" size={20} color="#6366f1" />
//             {pendingReports > 0 && (
//               <View style={styles.notificationBadge}>
//                 <Text style={styles.notificationBadgeText}>{pendingReports}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Stats Cards */}
//         <View style={styles.statsContainer}>
//           <View style={[styles.statCard, { backgroundColor: "#6366f1" }]}>
//             <MaterialIcons name="description" size={32} color="white" />
//             <Text style={styles.statNumber}>{totalReports}</Text>
//             <Text style={styles.statLabel}>Total Reports</Text>
//           </View>
//           <View style={[styles.statCard, { backgroundColor: "#ef4444" }]}>
//             <Ionicons name="time" size={32} color="white" />
//             <Text style={styles.statNumber}>{pendingReports}</Text>
//             <Text style={styles.statLabel}>Pending</Text>
//           </View>
//           <View style={[styles.statCard, { backgroundColor: "#10b981" }]}>
//             <Ionicons name="checkmark-circle" size={32} color="white" />
//             <Text style={styles.statNumber}>{resolvedReports}</Text>
//             <Text style={styles.statLabel}>Resolved</Text>
//           </View>
//         </View>

//         {/* Reports List */}
//         <View style={styles.reportsSection}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Reports to Handle</Text>
//             <TouchableOpacity style={styles.filterButton}>
//               <Ionicons name="filter" size={20} color="#6366f1" />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.reportsList}>
//             {reports.map((report) => (
//               <ReportCard key={report.id} report={report} />
//             ))}
//           </View>
//         </View>

//         {/* Account Section */}
//         <View style={styles.accountSection}>
//           <Text style={styles.sectionTitle}>Account</Text>
//           <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//             <Ionicons name="log-out" size={20} color="white" />
//             <Text style={styles.logoutButtonText}>Logout</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ height: 100 }} />
//       </ScrollView>

//       {/* Floating Action Button */}
//       <TouchableOpacity style={styles.floatingButton} onPress={handleFloatingButtonPress}>
//         <Ionicons name="add" size={24} color="white" />
//       </TouchableOpacity>

//       <MapAll
//         visible={showMap}
//         onClose={() => setShowMap(false)}
//         onLocationSelect={handleLocationSelect}
//         initialLocation={coordinates}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f9fafb",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "white",
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#eef2ff",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   welcomeText: {
//     fontSize: 14,
//     color: "#6b7280",
//     marginBottom: 2,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#111827",
//   },
//   notificationButton: {
//     position: "relative",
//     padding: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     backgroundColor: "transparent",
//   },
//   notificationBadge: {
//     position: "absolute",
//     top: -4,
//     right: -4,
//     backgroundColor: "#ef4444",
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   notificationBadgeText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   statCard: {
//     flex: 1,
//     padding: 20,
//     borderRadius: 12,
//     alignItems: "center",
//     marginHorizontal: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statNumber: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "white",
//     marginTop: 8,
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: "rgba(255, 255, 255, 0.9)",
//   },
//   reportsSection: {
//     backgroundColor: "white",
//     margin: 20,
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#111827",
//   },
//   filterButton: {
//     padding: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//   },
//   reportsList: {
//     gap: 12,
//   },
//   reportCard: {
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     borderLeftWidth: 4,
//     borderLeftColor: "#6366f1",
//     backgroundColor: "white",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   reportHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//   },
//   reportIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#eef2ff",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   reportContent: {
//     flex: 1,
//   },
//   reportTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 8,
//   },
//   badgeContainer: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   badge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   badgeText: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "white",
//   },
//   accountSection: {
//     backgroundColor: "white",
//     margin: 20,
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   logoutButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#ef4444",
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 16,
//   },
//   logoutButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//     marginLeft: 8,
//   },
//   floatingButton: {
//     position: "absolute",
//     bottom: 24,
//     right: 24,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#6366f1",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
// })

// export default MaintenanceHomeScreen