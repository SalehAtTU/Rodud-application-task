// src/screens/RegisterScreen.js

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axios';  // ← your axios instance

const RegisterScreen = ({ navigation }) => {
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [phone, setPhone]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]             = useState(false);
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);

  // Animation values
  const fadeAnim  = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords must match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/register', {
        name,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
      });
      Alert.alert('Success', 'Registered! Please sign in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      console.error(err.response?.data || err);
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Soft background effect */}
      <View style={styles.backgroundEffects}>
        <View style={[styles.gradientBubble, styles.bubble1]} />
        <View style={[styles.gradientBubble, styles.bubble2]} />
        <View style={[styles.gradientBubble, styles.bubble3]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Image
              source={require('../../assets/rodud logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appTitle}>Logistics Management</Text>
          <Text style={styles.appSubtitle}>Create your account</Text>
        </View>

        {/* Register card */}
        <Animated.View
          style={[
            styles.registerCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.registerTitle}>Sign Up</Text>

          {/* Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={18} color="#9b87f5" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9b87f5"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={18} color="#9b87f5" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9b87f5"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={18} color="#9b87f5" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#9b87f5"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={18} color="#9b87f5" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9b87f5"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword((v) => !v)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={18}
                color="#9b87f5"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={18} color="#9b87f5" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#9b87f5"
              value={confirmPassword}
              secureTextEntry={!showConfirm}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirm((v) => !v)}
            >
              <Ionicons
                name={showConfirm ? 'eye-off' : 'eye'}
                size={18}
                color="#9b87f5"
              />
            </TouchableOpacity>
          </View>

          {/* Create Account */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="person-add" size={16} color="white" />
                <Text style={styles.buttonText}>Create Account</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.switchLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} Rodud Logistics</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F0FB' },
  backgroundEffects: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  gradientBubble: { position: 'absolute', borderRadius: 300 },
  bubble1: { top: -50, left: -100, width: 300, height: 300, backgroundColor: '#E5DEFF', opacity: 0.5 },
  bubble2: { top: 200, right: -150, width: 350, height: 350, backgroundColor: '#F1F0FB', opacity: 0.7 },
  bubble3: { bottom: -100, left: -50, width: 250, height: 250, backgroundColor: '#E5DEFF', opacity: 0.6 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 30 },
  logoContainer: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  logoBox: {
    width: 90, height: 50, backgroundColor: 'white', borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  logo: { width: 70, height: 35 },
  appTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 5 },
  appSubtitle: { fontSize: 13, color: '#777' },
  registerCard: {
    backgroundColor: 'white', borderRadius: 16, padding: 24, marginHorizontal: 5,
    shadowColor: '#9b87f5', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
  },
  registerTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 24, textAlign: 'center' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7F7FC', borderRadius: 12, marginBottom: 16,
    height: 52, borderWidth: 1, borderColor: '#EAE7F9',
  },
  inputIcon: { paddingLeft: 16 },
  input: { flex: 1, paddingVertical: 12, paddingLeft: 12, color: '#333', fontSize: 15 },
  eyeIcon: { paddingRight: 16 },
  registerButton: {
    backgroundColor: '#9b87f5', borderRadius: 12, height: 52,
    justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 20,
    shadowColor: '#9b87f5', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
  },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  switchText: { fontSize: 14, color: '#777' },
  switchLink: { fontSize: 14, color: '#9b87f5', fontWeight: '600' },
  footer: { marginVertical: 16, alignItems: 'center' },
  footerText: { color: '#999', fontSize: 12 },
});

export default RegisterScreen;
