// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import * as Localization from 'expo-localization';
import { Ionicons } from '@expo/vector-icons';
import { t, setLocale } from '../i18n';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'عربي'   },
  { code: 'ur', label: 'اردو'   },
];

export default function ProfileScreen({ navigation }) {
  const [current, setCurrent] = useState('en');
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    let device = Localization.locale.split('-')[0];
    if (!LANGUAGES.some(l => l.code === device)) device = 'en';
    setCurrent(device);
    setLocale(device);
  }, []);

  const pick = code => {
    setCurrent(code);
    setLocale(code);
  };

  const onSave = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'App' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, isWeb && styles.headerWeb]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isWeb && styles.headerTitleWeb]}>
          {t('choose_language')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={[styles.content, isWeb && styles.contentWeb]}>
        <Text style={[styles.label, isWeb && styles.labelWeb]}>
          {t('choose_language')}
        </Text>

        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.langItem,
              current === lang.code && styles.langItemActive,
              isWeb && styles.langItemWeb,
            ]}
            onPress={() => pick(lang.code)}
          >
            <Text
              style={[
                styles.langText,
                current === lang.code && styles.langTextActive,
                isWeb && styles.langTextWeb,
              ]}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.saveBtn, isWeb && styles.saveBtnWeb]}
          onPress={onSave}
        >
          <Text style={[styles.saveText, isWeb && styles.saveTextWeb]}>
            {t('save')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // always full-height white background
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // HEADER
  header: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    padding:          20,
    borderBottomWidth: 1,
    borderColor:      '#eee',
  },
  // on web, center header and cap width
  headerWeb: {
    alignSelf:    'center',
    width:        '100%',
    maxWidth:     360,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize:   20,
    fontWeight: '600',
  },
  headerTitleWeb: {
    fontSize: 22,
    flexShrink: 1,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },

  // CONTENT WRAPPER
  content: {
    padding: 20,
  },
  // on web, center & narrow column
  contentWeb: {
    alignItems:    'center',
    width:         '100%',
    maxWidth:      360,
    alignSelf:     'center',
    paddingTop:    24,
  },

  label: {
    fontSize:     16,
    fontWeight:   '500',
    marginBottom: 12,
  },
  labelWeb: {
    fontSize: 18,
    marginBottom: 16,
    whiteSpace: 'nowrap',
  },

  langItem: {
    padding:         12,
    borderRadius:    8,
    backgroundColor: '#f0f0f0',
    marginBottom:    8,
    minWidth:        120,
    alignSelf:       'flex-start',
  },
  langItemActive: {
    backgroundColor: '#7e22ce',
  },
  langItemWeb: {
    width:          '100%',
    marginBottom:   16,
  },

  langText: {
    fontSize: 16,
    color:    '#333',
  },
  langTextActive: {
    color:      '#fff',
    fontWeight: '600',
  },
  langTextWeb: {
    fontSize:   18,
    textAlign:  'center',
  },

  saveBtn: {
    marginTop:       'auto',
    backgroundColor: '#7e22ce',
    paddingVertical: 16,
    borderRadius:    8,
    alignItems:      'center',
    marginTop:       20,
  },
  saveBtnWeb: {
    width:           '100%',
    marginTop:       24,
    paddingVertical: 20,
  },

  saveText: {
    color:      '#fff',
    fontSize:   16,
    fontWeight: '600',
  },
  saveTextWeb: {
    fontSize: 18,
  },
});
