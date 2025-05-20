// src/shims/MapViewStub.js
import React from 'react';
import { View } from 'react-native';

export default function MapViewStub(props) {
  return <View {...props} />;
}
export const Marker = () => null;
