import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, ActivityIndicator,
  Alert, TouchableOpacity, ScrollView, Platform, Linking
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DropDownPicker             from 'react-native-dropdown-picker';
import { t }                      from '../i18n';
import api                        from '../api/axios';

export default function AdminOrderDetailsScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [status,  setStatus]  = useState(null);

  const statuses = [
    { label: t('pending'),     value: 'pending'     },
    { label: t('in_progress'), value: 'in_progress' },
    { label: t('delivered'),   value: 'delivered'   },
  ];

  useEffect(() => {
    api.get(`/shipments/${orderId}`)
      .then(res => {
        setOrder(res.data);
        setStatus(res.data.status);
      })
      .catch(err => {
        console.error(err);
        Alert.alert(t('error'), t('could_not_load_order'));
        navigation.goBack();
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const saveStatus = async () => {
    try {
      await api.put(`/shipments/${orderId}`, { status });
      Alert.alert(t('success'), t('status_updated'));
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert(t('error'), t('could_not_update_status'));
    }
  };

  const openRouteInMaps = () => {
    if (!order) return;
    const origin      = encodeURIComponent(order.pickup_address);
    const destination = encodeURIComponent(order.dropoff_address);
    const url = Platform.select({
      ios:    `http://maps.apple.com/?saddr=${origin}&daddr=${destination}`,
      android:`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
    });
    Linking.openURL(url).catch(() =>
      Alert.alert(t('error'), t('could_not_open_maps'))
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7e22ce" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#666' }}>{t('order_not_found')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Back + Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('order')} #{order.id}</Text>
        <View style={{ width:24 }}/>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* DETAILS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('shipment_details')}</Text>

          <View style={styles.row}>
            <MaterialIcons name="person-outline" size={20} color="#7e22ce" />
            <Text style={styles.label}>{t('user')}</Text>
          </View>
          <Text style={styles.value}>{order.user?.name || '—'}</Text>

          <View style={[styles.row,{marginTop:12}]}>
            <MaterialIcons name="place" size={20} color="#7e22ce" />
            <Text style={styles.label}>{t('pickup')}</Text>
          </View>
          <Text style={styles.value}>{order.pickup_address}</Text>

          <View style={[styles.row,{marginTop:12}]}>
            <MaterialIcons name="place" size={20} color="green" />
            <Text style={styles.label}>{t('dropoff')}</Text>
          </View>
          <Text style={styles.value}>{order.dropoff_address}</Text>

          <View style={[styles.row,{marginTop:12}]}>
            <MaterialIcons name="inventory" size={20} color="#7e22ce" />
            <Text style={styles.label}>{t('cargo')}</Text>
          </View>
          <Text style={styles.value}>{t(order.cargo_type)}</Text>

          <View style={[styles.row,{marginTop:12}]}>
            <MaterialIcons name="barbell" size={20} color="#7e22ce" />
            <Text style={styles.label}>{t('weight')}</Text>
          </View>
          <Text style={styles.value}>{t(order.weight)}</Text>

          <View style={[styles.row,{marginTop:12}]}>
            <MaterialIcons name="local-shipping" size={20} color="#7e22ce" />
            <Text style={styles.label}>{t('truck')}</Text>
          </View>
          <Text style={styles.value}>{t(order.truck_type)}</Text>

          <TouchableOpacity style={styles.mapsBtn} onPress={openRouteInMaps}>
            <Text style={styles.mapsBtnText}>{t('open_in_maps')}</Text>
          </TouchableOpacity>
        </View>

        {/* STATUS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('change_status')}</Text>
          <View style={{ zIndex:1000, marginTop:12 }}>
            <DropDownPicker
              open                 = {open}
              value                = {status}
              items                = {statuses}
              setOpen              = {setOpen}
              setValue             = {setStatus}
              placeholder          = {t('select_status')}
              style                = {styles.picker}
              dropDownContainerStyle={styles.picker}
            />
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={saveStatus}>
            <Text style={styles.saveBtnText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex:1,
    backgroundColor:'#f2f3f5',
    paddingTop: Platform.OS==='android'?20:40,
  },
  center:{ flex:1,justifyContent:'center',alignItems:'center' },

  header:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingVertical:12,
    paddingHorizontal:16,
    backgroundColor:'#fff',
    elevation:2,
  },
  title:{ fontSize:18,fontWeight:'600' },

  content:{ padding:16,paddingBottom:32 },

  card:{
    backgroundColor:'#fff',
    borderRadius:12,
    padding:16,
    marginBottom:20,
    elevation:3,
  },
  cardTitle:{ fontSize:16,fontWeight:'600',marginBottom:12 },

  row:{ flexDirection:'row',alignItems:'center' },
  label:{ marginLeft:8,fontSize:14,fontWeight:'500',color:'#333' },
  value:{ marginTop:4,fontSize:15,color:'#555',lineHeight:22 },

  mapsBtn:{
    marginTop:20,
    backgroundColor:'#7e22ce',
    paddingVertical:10,
    borderRadius:8,
    alignItems:'center',
  },
  mapsBtnText:{ color:'#fff',fontWeight:'600' },

  picker:{
    backgroundColor:'#f7f7f7',
    borderColor:'#e0e0e0',
    borderRadius:8,
  },

  saveBtn:{
    marginTop:20,
    backgroundColor:'#7e22ce',
    paddingVertical:14,
    borderRadius:8,
    alignItems:'center',
  },
  saveBtnText:{ color:'#fff',fontWeight:'600',fontSize:16 },
});
