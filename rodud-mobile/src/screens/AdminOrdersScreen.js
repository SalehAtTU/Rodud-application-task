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
  Platform,
  ScrollView,
  useWindowDimensions,
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

  // detect desktop on web
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/admin/shipments');
        setOrders(res.data);
      } catch {
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
      } catch {
        Alert.alert(t('error'), t('could_not_load_orders'));
      } finally {
        setRefreshing(false);
      }
    })();
  };

  const filtered = orders.filter(o => o.status === tab);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7e22ce" />
      </View>
    );
  }

  // shared card renderer
  const renderCard = (item) => (
    <View
      key={item.id}
      style={[styles.card, isDesktop && styles.cardDesktop]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>#{item.id}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: {
                pending:     '#FFA500',
                in_progress:'#007bff',
                delivered:   '#28a745',
              }[item.status]
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
        style={[styles.detailBtn, isDesktop && styles.detailBtnDesktop]}
        onPress={() =>
          navigation.navigate('AdminOrderDetails', { orderId: item.id })
        }
      >
        <Text style={[styles.detailBtnText, isDesktop && styles.detailBtnTextDesktop]}>
          {t('view_update')}
        </Text>
        <Ionicons name="arrow-forward" size={16} color="#7e22ce" />
      </TouchableOpacity>
    </View>
  );

  // WEB: pinned header+tabs, scrollable grid of cards
  if (Platform.OS === 'web') {
    return (
      <ScrollView
        style={styles.webContainer}
        contentContainerStyle={styles.webContent}
      >
        <View style={styles.stickyHeader}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>{t('all_orders')}</Text>
            <View style={{ width: 24 }} />
          </View>
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
        </View>

        <View style={isDesktop ? styles.desktopGrid : null}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {t('no_orders', { status: t(tab) })}
              </Text>
            </View>
          ) : (
            filtered.map(renderCard)
          )}
        </View>
      </ScrollView>
    );
  }

  // MOBILE: original FlatList
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('all_orders')}</Text>
        <View style={{ width: 24 }} />
      </View>

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

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.ordersList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {t('no_orders', { status: t(tab) })}
            </Text>
          </View>
        }
        renderItem={({ item }) => renderCard(item)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // mobile container
  container:    { flex: 1, backgroundColor: '#f2f3f5' },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // web ScrollView container
  webContainer: {
    height:        '100vh',
    overflowY:     'auto',
    backgroundColor: '#f2f3f5',
  },
  webContent: {
    padding:        16,
    alignItems:     'center',
  },

  // sticky wrapper for header & tabs on web
  stickyHeader: {
    position:      'sticky',
    top:           0,
    zIndex:        10,
    width:         '100%',
    backgroundColor: '#fff',
  },

  header:       {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        20,
    paddingTop:     50,
    backgroundColor:'#fff',
    elevation:      2,
  },
  title:        { fontSize: 20, fontWeight: '600' },

  tabs:          { flexDirection: 'row', marginBottom: 12, backgroundColor: '#eee', borderRadius: 8 },
  tab:           { flex: 1, padding: 10, alignItems: 'center' },
  tabActive:     { backgroundColor: '#fff' },
  tabText:       { color: '#666' },
  tabTextActive: { color: '#7e22ce', fontWeight: '600' },

  // desktop grid layout
  desktopGrid: {
    flexDirection:   'row',
    flexWrap:        'wrap',
    justifyContent:  'center',
  },

  // card base + desktop override
  card:          {
    backgroundColor:'#fff',
    borderRadius:   10,
    padding:        15,
    margin:         8,
    elevation:      1,
    width:          '100%', // mobile
  },
  cardDesktop:   {
    maxWidth:       500,
    width:          '45%',
  },

  badge:         { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  badgeText:     { color: '#fff', fontSize: 12 },

  user:          { color: '#333', marginBottom: 4 },
  date:          { color: '#333', marginBottom: 8 },

  detailBtn:     {
    flexDirection:  'row',
    alignItems:     'center',
    backgroundColor:'#f3f0fe',
    paddingVertical:8,
    paddingHorizontal:8,
    borderRadius:   8,
    alignSelf:      'flex-start',
  },
  detailBtnDesktop: {
    paddingVertical:12,
    paddingHorizontal:16,
  },
  detailBtnText:{ color: '#7e22ce', marginRight: 5 },
  detailBtnTextDesktop:{ fontSize: 16 },

  // mobile FlatList
  list:          { flex: 1 },
  ordersList:    { padding: 16, paddingBottom: 40 },

  empty:         { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText:     { color: '#666' },
});
