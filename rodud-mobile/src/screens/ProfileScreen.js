// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Localization from 'expo-localization';
import { Ionicons }       from '@expo/vector-icons';
import { t, setLocale }   from '../i18n';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'عربي'   },
  { code: 'ur', label: 'اردو'   },
];

export default function ProfileScreen({ navigation }) {
  const [current, setCurrent] = useState('en');

  useEffect(() => {
    let device = Localization.locale.split('-')[0];
    if (!LANGUAGES.some(l => l.code === device)) device = 'en';
    setCurrent(device);
    setLocale(device);
  }, []);

  const pick = (code) => {
    setCurrent(code);
    setLocale(code);
  };

  const onSave = () => {
    // Reset into the "App" stack so drawer can route to Admin or Shipments as appropriate
    navigation.reset({
      index: 0,
      routes: [{ name: 'App' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('choose_language')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.label}>{t('choose_language')}</Text>
      {LANGUAGES.map(lang => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.langItem,
            current === lang.code && styles.langItemActive,
          ]}
          onPress={() => pick(lang.code)}
        >
          <Text style={[
            styles.langText,
            current === lang.code && styles.langTextActive,
          ]}>
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveText}>{t('save')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#fff', padding: 20 },
  header:         {
                    flexDirection:    'row',
                    alignItems:       'center',
                    justifyContent:   'space-between',
                    paddingBottom:    12,
                    borderBottomWidth:1,
                    borderColor:      '#eee',
                  },
  backBtn:        { padding: 4 },
  headerTitle:    { fontSize: 20, fontWeight: '600' },

  label:          { fontSize: 16, marginTop: 20, marginBottom: 12, fontWeight: '500' },

  langItem:       {
                    padding:        12,
                    borderRadius:   8,
                    backgroundColor:'#f0f0f0',
                    marginBottom:   8,
                  },
  langItemActive: { backgroundColor: '#7e22ce' },
  langText:       { fontSize: 16, color: '#333' },
  langTextActive: { color: '#fff', fontWeight: '600' },

  saveBtn:        {
                    marginTop:     'auto',
                    backgroundColor:'#7e22ce',
                    padding:       16,
                    borderRadius:  8,
                    alignItems:    'center',
                  },
  saveText:       { color: '#fff', fontSize: 16, fontWeight: '600' },
});
