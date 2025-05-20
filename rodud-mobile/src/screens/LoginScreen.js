// src/screens/LoginScreen.js
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
  ActivityIndicator,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axios';

export default function LoginScreen({ navigation }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword]         = useState('');
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation
  const fadeAnim  = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/login', {
        email_or_phone: emailOrPhone,
        password,
      });
      const { token, user } = res.data;
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      navigation.reset({ index: 0, routes: [{ name: 'App' }] });
    } catch (err) {
      console.error(err.response?.data || err);
      const msg = err.response?.data?.message ||
                  'Login failed. Please check your credentials.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  // Desktop/web detection
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.container, isWeb && styles.containerWeb]}>
      <StatusBar barStyle="dark-content" />

      {/* Background bubbles */}
      <View style={styles.backgroundEffects}>
        <View style={[styles.gradientBubble, styles.bubble1]} />
        <View style={[styles.gradientBubble, styles.bubble2]} />
        <View style={[styles.gradientBubble, styles.bubble3]} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isWeb && styles.scrollContentWeb,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo + titles */}
        <View style={[
          styles.logoContainer,
          isWeb && styles.logoContainerWeb
        ]}>
          <View style={styles.logoBox}>
            <Image
              source={require('../../assets/rodud logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appTitle}>Logistics Management</Text>
          <Text style={styles.appSubtitle}>Manage your shipments efficiently</Text>
        </View>

        {/* Animated login card */}
        <Animated.View
          style={[
            styles.loginCard,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            isWeb && styles.loginCardWeb,
          ]}
        >
          <Text style={styles.loginTitle}>Sign In</Text>

          {/* Email or Phone */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={18} color="#9b87f5" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email or Phone"
              placeholderTextColor="#9b87f5"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={18} color="#9b87f5" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9b87f5"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(v => !v)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={18}
                color="#9b87f5"
              />
            </TouchableOpacity>
          </View>

          {/* Sign In button */}
          <TouchableOpacity
            style={[styles.loginButton, isWeb && styles.loginButtonWeb]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="log-in" size={16} color="white" />
                <Text style={styles.buttonText}>Sign In</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.switchLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={[styles.footer, isWeb && styles.footerWeb]}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Rodud Logistics
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F0FB',
  },
  containerWeb: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  backgroundEffects: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientBubble: {
    position: 'absolute',
    borderRadius: 300,
  },
  bubble1: {
    top: -50,
    left: -100,
    width: 300,
    height: 300,
    backgroundColor: '#E5DEFF',
    opacity: 0.5,
  },
  bubble2: {
    top: 200,
    right: -150,
    width: 350,
    height: 350,
    backgroundColor: '#F1F0FB',
    opacity: 0.7,
  },
  bubble3: {
    bottom: -100,
    left: -50,
    width: 250,
    height: 250,
    backgroundColor: '#E5DEFF',
    opacity: 0.6,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  scrollContentWeb: {
    width: '100%',
    maxWidth: 400,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoContainerWeb: {
    marginTop: 0,
    marginBottom: 50,
  },
  logoBox: {
    width: 90,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logo: {
    width: 70,
    height: 35,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#777',
  },

  loginCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 5,
    shadowColor: '#9b87f5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
  },
  loginCardWeb: {
    maxWidth: 360,
    marginHorizontal: 0,
    width: '100%',
  },

  loginTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FC',
    borderRadius: 12,
    marginBottom: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#EAE7F9',
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 12,
    color: '#333',
    fontSize: 15,
  },
  eyeIcon: {
    paddingRight: 16,
  },

  loginButton: {
    backgroundColor: '#9b87f5',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#9b87f5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonWeb: {
    width: '100%',
    paddingVertical: 16,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  switchText: {
    fontSize: 14,
    color: '#777',
  },
  switchLink: {
    fontSize: 14,
    color: '#9b87f5',
    fontWeight: '600',
  },

  footer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  footerWeb: {
    marginVertical: 30,
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
});
