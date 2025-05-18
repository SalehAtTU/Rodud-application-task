// src/config.js
import { Platform } from 'react-native';

// If you’re running on a real device or Expo Go, use your machine’s LAN IP;
// if on an Android emulator, use 10.0.2.2 to reach localhost.
const LOCAL_IP = '192.168.8.177';   // ← replace with your PC’s LAN IP if different
const EMULATOR = '10.0.2.2';
const host     = Platform.OS === 'android' ? EMULATOR : LOCAL_IP;

export const API_URL = `http://${host}:8000/api`;
