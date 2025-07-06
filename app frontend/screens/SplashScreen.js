// SplashScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Use your own image asset here
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.heading}>Report Issues Effortlessly</Text>
      <Text style={styles.description}>
        Spotted a pothole or a damaged road? Easily report issues by uploading images and location details. 
        No more long bureaucratic processes.
      </Text>

      <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonTextSecondary}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  buttonPrimary: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonSecondary: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 15,
    borderRadius: 25,
  },
  buttonTextSecondary: {
    color: '#000',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
