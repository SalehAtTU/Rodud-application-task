// App.js
import 'react-native-gesture-handler';
import './src/i18n';               // ← runs our setup
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}
