import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ReportRoadIssue from './screens/ReportRoadIssues';
import PreviousReports from './screens/PreviousReports';
import UserProfile from './screens/UserProfile';
import maintanancevalid from './screens/maintanancevalid';
// import MaintenanceHomeScreen from './screens/MaintenanceHomeScreen';
import MaintenanceHomeSCreen from './Maintainance'
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ReportRoadIssue" component={ReportRoadIssue} />
        <Stack.Screen name="PreviousReports" component={PreviousReports} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="maintanancevalid" component={maintanancevalid}  />
        <Stack.Screen name="MaintenanceHome" component={MaintenanceHomeSCreen} options={{ headerShown: false }} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
