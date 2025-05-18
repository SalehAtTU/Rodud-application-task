import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  FlatList, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import api from '../api/axios';
import { t } from '../i18n';

export default function MyShipmentsScreen({ navigation }) {
  const [tab, setTab]           = useState('Active');
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/shipments');
      setShipments(res.data);
    } catch {
      Alert.alert(t('error'), t('could_not_load_shipments'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
    const unsub = navigation.addListener('focus', fetchShipments);
    return unsub;
  }, [navigation]);

  const filtered = shipments.filter(s =>
    tab === 'Active' ? s.status !== 'delivered' : s.status === 'delivered'
  );

  const renderCard = ({ item }) => {
    const colors = {
      pending:     '#FFA500',
      in_progress: '#007bff',
      delivered:   '#28a745',
    };
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {t('shipment')} #{item.id}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.pill, { backgroundColor: colors[item.status] }]}>
            <Text style={styles.pillText}>{t(item.status)}</Text>
          </View>
          <Text style={styles.cardStatus}>
            ETA {new Date(item.dropoff_date).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() =>
            navigation.navigate('ShipmentDetails', { shipment: item })
          }
        >
          <Text style={styles.cardButtonText}>{t('view_details')}</Text>
          <Ionicons name="arrow-forward" size={16} color="#7e22ce" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7e22ce" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('my_shipments')}</Text>
        <Ionicons name="notifications-outline" size={24} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['Active','Completed'].map(label => (
          <TouchableOpacity
            key={label}
            style={[styles.tab, tab === label && styles.tabActive]}
            onPress={() => setTab(label)}
          >
            <Text
              style={[styles.tabText, tab === label && styles.tabTextActive]}
            >
              {t(label.toLowerCase())}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={renderCard}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {t('no_shipments', { status: t(tab.toLowerCase()) })}
            </Text>
          </View>
        )}
      />

      {/* New Shipment Button */}
      <TouchableOpacity
        style={styles.newBtn}
        onPress={() => navigation.navigate('NewShipment')}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.newBtnText}>{t('new_shipment')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:'#f8f8f8' },
  center:       { flex:1, justifyContent:'center', alignItems:'center' },
  header:       {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:   'center',
    padding:       20,
    paddingTop:    50,
    backgroundColor:'#fff',
  },
  title:        { fontSize:20, fontWeight:'600' },
  tabs:         {
    flexDirection:'row',
    margin:        20,
    backgroundColor:'#eee',
    borderRadius:  10,
  },
  tab:          { flex:1, padding:10, alignItems:'center' },
  tabActive:    { backgroundColor:'#fff' },
  tabText:      { color:'#888' },
  tabTextActive:{ color:'#7e22ce', fontWeight:'600' },
  list:         { paddingHorizontal:20, paddingBottom:100 },
  card:         { backgroundColor:'#fff', padding:15, borderRadius:10, marginBottom:15 },
  cardTitle:    { fontSize:16, fontWeight:'600', marginBottom:6 },
  statusRow:    { flexDirection:'row', alignItems:'center', marginBottom:10 },
  pill:         { paddingVertical:4, paddingHorizontal:8, borderRadius:12, marginRight:10 },
  pillText:     { color:'#fff', fontSize:12, textTransform:'capitalize' },
  cardStatus:   { color:'#666' },
  cardButton:   {
    flexDirection:'row',
    alignItems:   'center',
    backgroundColor:'#f3f0fe',
    padding:      8,
    borderRadius: 8,
  },
  cardButtonText:{ color:'#7e22ce', marginRight:5 },
  newBtn:       {
    position:     'absolute',
    bottom:        30,
    right:         20,
    backgroundColor:'#7e22ce',
    flexDirection:'row',
    alignItems:   'center',
    padding:       15,
    borderRadius:  30,
  },
  newBtnText:   { color:'#fff', marginLeft:8, fontWeight:'600' },
  empty:        { alignItems:'center', marginTop:50 },
  emptyText:    { color:'#666' },
});
