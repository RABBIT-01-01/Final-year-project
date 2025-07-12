"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CommonActions } from "@react-navigation/native"

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      
      const response = await fetch('http://192.168.1.78:4000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      // const response = await fetch('http://localhost:4000/api/users/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // })
      alert("Request sent to server")
      alert("Response: " + JSON.stringify(response))

      const data = await response.json()

      if (!response.ok) {
        const message = data.message || 'Invalid email or password'
        Alert.alert('Login Failed', message)
        setIsLoading(false)
        return
      }

      const { token, user } = data
      // Save token and user data
      await AsyncStorage.setItem('@user_token', token)
      await AsyncStorage.setItem('@user_data', JSON.stringify(user))

      // Reset navigation stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        }),
      )
    } catch (error) {
      
      Alert.alert('Error', 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appIcon}>🚧</Text>
            <Text style={styles.appTitle}>Sadak</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>{isLoading ? "Signing In..." : "Sign In"}</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate("Register")}> 
              <Text style={styles.registerLinkText}>
                Don't have an account? <Text style={styles.registerLinkBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  appIcon: { fontSize: 64, marginBottom: 16 },
  appTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, backgroundColor: '#f8f9fa' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, backgroundColor: '#f8f9fa' },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  eyeButton: { paddingHorizontal: 16, paddingVertical: 12 },
  eyeIcon: { fontSize: 20 },
  loginButton: { backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  loginButtonDisabled: { backgroundColor: '#ccc' },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  dividerText: { marginHorizontal: 16, color: '#666', fontSize: 14 },
  registerLink: { alignItems: 'center' },
  registerLinkText: { fontSize: 16, color: '#666' },
  registerLinkBold: { color: '#007AFF', fontWeight: '600' },
})

export default LoginScreen
