import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"

import HomeScreen from "./src/HomeScreen"
import MapScreen from "./src/MapScreen"
import ProfileScreen from "./src/ProfileScreen"
import { RouteProp } from "@react-navigation/native"

const Tab = createBottomTabNavigator()

export default function Maintainance({ route }: { route: RouteProp<any, any> }) {
  const maintenanceTeam = route.params?.maintenanceTeam
  return (
    <>
      <StatusBar style="auto" />
      <Tab.Navigator
      id ={undefined}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline"
            } else if (route.name === "Map") {
              iconName = focused ? "map" : "map-outline"
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline"
            } else {
              iconName = "help-outline"
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: "#2563eb",
          tabBarInactiveTintColor: "#6b7280",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          headerStyle: {
            backgroundColor: "#2563eb",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        })}
      >
       <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ maintenanceTeam }}
          options={{ title: "Road Hazards" }}
        />
        <Tab.Screen name="Map" component={MapScreen}  initialParams={{ maintenanceTeam }} options={{ title: "Reports Map" }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
      </Tab.Navigator>
    </>
  )
}
