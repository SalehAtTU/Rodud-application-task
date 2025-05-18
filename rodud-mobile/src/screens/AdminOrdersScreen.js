// src/screens/AdminOrdersScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axios';
import { t } from '../i18n';

const STATUSES = ['pending', 'in_progress', 'delivered'];

export default function AdminOrdersScreen({ navigation }) {
  const [orders, setOrders]         = useState([]);
  const [tab, setTab]               = useState('pending');
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/admin/shipments');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        Alert.alert(t('error'), t('could_not_load_orders'));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    })();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    (async () => {
      try {
        const res = await api.get('/admin/shipments');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        Alert.alert(t('error'), t('could_not_load_orders'));
      } finally {
        setRefreshing(false);
      }
    })();
  };

  // filter by selected status
  const filtered = orders.filter(o => o.status === tab);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7e22ce" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('all_orders')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {STATUSES.map(statusKey => (
          <TouchableOpacity
            key={statusKey}
            style={[styles.tab, tab === statusKey && styles.tabActive]}
            onPress={() => setTab(statusKey)}
          >
            <Text
              style={[
                styles.tabText,
                tab === statusKey && styles.tabTextActive
              ]}
            >
              {t(statusKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {t('no_orders', { status: t(tab) })}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>#{item.id}</Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: {
                      pending:     '#FFA500',
                      in_progress:'#007bff',
                      delivered:   '#28a745',
                    }[item.status],
                  },
                ]}
              >
                <Text style={styles.badgeText}>{t(item.status)}</Text>
              </View>
            </View>

            <Text style={styles.user}>
              {t('user')}: {item.user?.name || item.user_name || '—'}
            </Text>
            <Text style={styles.date}>
              {t('date')}: {new Date(item.created_at).toLocaleDateString()}
            </Text>

            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() =>
                navigation.navigate('AdminOrderDetails', { orderId: item.id })
              }
            >
              <Text style={styles.detailBtnText}>{t('view_update')}</Text>
              <Ionicons name="arrow-forward" size={16} color="#7e22ce" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f2f3f5' },
  center:    { flex:1, justifyContent:'center', alignItems:'center' },

  header:    {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    padding:         20,
    paddingTop:      50,
    backgroundColor: '#fff',
    elevation:       2,
  },
  title:     { fontSize:20, fontWeight:'600' },

  tabs:          { flexDirection:'row', margin:12, backgroundColor:'#eee', borderRadius:8 },
  tab:           { flex:1, padding:10, alignItems:'center' },
  tabActive:     { backgroundColor:'#fff' },
  tabText:       { color:'#666' },
  tabTextActive: { color:'#7e22ce', fontWeight:'600' },

  empty:     { flex:1, justifyContent:'center', alignItems:'center', marginTop:50 },
  emptyText: { color:'#666' },

  card:        {
    backgroundColor:'#fff',
    borderRadius:   10,
    padding:        15,
    marginBottom:   12,
    elevation:      1,
  },
  cardHeader:  {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:    'center',
    marginBottom:  8,
  },
  cardTitle:   { fontSize:16, fontWeight:'600' },

  badge:       { paddingVertical:4, paddingHorizontal:8, borderRadius:12 },
  badgeText:   { color:'#fff', fontSize:12 },

  user:        { color:'#333', marginBottom:4 },
  date:        { color:'#333', marginBottom:8 },

  detailBtn:   {
    flexDirection:'row',
    alignItems:   'center',
    backgroundColor:'#f3f0fe',
    padding:      8,
    borderRadius: 8,
    alignSelf:    'flex-start',
  },
  detailBtnText:{ color:'#7e22ce', marginRight:5 },
});
