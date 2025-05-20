// src/screens/MapPickerScreen.web.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapPickerScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>
        Map picker is not available on web. Please use the mobile app.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text:   { fontSize: 16, textAlign: 'center', padding: 20 }
});
