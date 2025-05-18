// src/components/CustomDrawerContent.js
import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from '../i18n';

export default function CustomDrawerContent({ navigation, user }) {
  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('confirm_logout'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Admin menu
  if (user.is_admin) {
    return (
      <DrawerContentScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.closeDrawer()}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            navigation.navigate('Admin');
            navigation.closeDrawer();
          }}
        >
          <Ionicons name="layers-outline" size={22} color="#333" />
          <Text style={styles.itemText}>{t('admin_dashboard')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            navigation.navigate('Profile');
            navigation.closeDrawer();
          }}
        >
          <Ionicons name="language-outline" size={22} color="#333" />
          <Text style={styles.itemText}>{t('choose_language')}</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={[styles.item, styles.logout]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#d00" />
          <Text style={[styles.itemText, { color: '#d00' }]}>{t('logout')}</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    );
  }

  // Normal user menu
  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.closeDrawer()}>
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.navigate('Shipments');
          navigation.closeDrawer();
        }}
      >
        <Ionicons name="cube-outline" size={22} color="#333" />
        <Text style={styles.itemText}>{t('my_shipments')}</Text>
      </TouchableOpacity>

      

      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.navigate('Profile');
          navigation.closeDrawer();
        }}
      >
        <Ionicons name="language-outline" size={22} color="#333" />
        <Text style={styles.itemText}>{t('choose_language')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.navigate('ContactSupport');
          navigation.closeDrawer();
        }}
      >
        <Ionicons name="headset-outline" size={22} color="#333" />
        <Text style={styles.itemText}>{t('contact_support')}</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={[styles.item, styles.logout]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#d00" />
        <Text style={[styles.itemText, { color: '#d00' }]}>{t('logout')}</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, paddingTop:40, paddingHorizontal:20, backgroundColor:'#fff' },
  closeBtn:  { alignSelf:'flex-end', marginBottom:20 },
  item:     { flexDirection:'row', alignItems:'center', paddingVertical:15 },
  itemText: { fontSize:16, marginLeft:15, color:'#333' },
  separator:{ height:1, backgroundColor:'#eee', marginVertical:20 },
  logout:   { marginTop:0 },
});
