// src/shims/react-native-maps/index.js
import React from 'react';
import { View } from 'react-native';

// A no-op MapView
export default function MapView(props) {
  return <View {...props} />;
}

// A no-op Marker
export const Marker = () => null;
