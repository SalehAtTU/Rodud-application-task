import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons }                   from '@expo/vector-icons';
import { MaterialIcons }              from '@expo/vector-icons';
import { MaterialCommunityIcons }     from '@expo/vector-icons';
import api                           from '../api/axios';
import { t }                         from '../i18n';

export default function ShipmentDetailsScreen({ route, navigation }) {
  const stub    = route.params?.shipment;
  const [shipment, setShipment] = useState(stub || null);
  const [loading,  setLoading]  = useState(!stub);

  useEffect(() => {
    if (!stub) {
      api.get(`/shipments/${route.params.shipmentId}`)
        .then(res => setShipment(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7e22ce" />
      </View>
    );
  }
  if (!shipment) {
    return (
      <View style={styles.center}>
        <Text style={{ color:'#666' }}>{t('shipment_not_found')}</Text>
      </View>
    );
  }

  const {
    id,
    pickup_address,
    dropoff_address,
    cargo_type,
    weight,
    truck_type,
    status,
  } = shipment;

  const steps = [
    { key:'picked_up', title: t('picked_up'), done: true },
    { key:'delivered', title: t('delivered'), done: status === 'delivered' },
  ];

  const openMaps = () => {
    const o = encodeURIComponent(pickup_address);
    const d = encodeURIComponent(dropoff_address);
    const url = Platform.select({
      ios:    `http://maps.apple.com/?saddr=${o}&daddr=${d}`,
      android:`https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}`,
    });
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('shipment')} #{id}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ContactSupport',{ shipmentId:id })}
          style={styles.headerAction}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#7e22ce" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Map Card */}
        <View style={styles.card}>
          <View style={styles.mapRow}>
            <MaterialIcons name="place" size={20} color="#7e22ce" />
            <Text style={styles.mapLabel}>{t('pickup')}</Text>
          </View>
          <Text style={styles.mapText}>{pickup_address}</Text>

          <View style={[styles.mapRow, { marginTop:12 }]}>
            <MaterialIcons name="place" size={20} color="green" />
            <Text style={styles.mapLabel}>{t('dropoff')}</Text>
          </View>
          <Text style={styles.mapText}>{dropoff_address}</Text>

          <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
            <Text style={styles.mapButtonText}>{t('open_in_maps')}</Text>
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('status')}</Text>
          <View style={styles.statusBadgeContainer}>
            <Text style={[styles.statusBadge, styles[`badge_${status}`]]}>
              {t(status)}
            </Text>
          </View>
        </View>

        {/* Timeline Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('timeline')}</Text>
          <View style={styles.timeline}>
            {steps.map((step, i) => (
              <View key={step.key} style={styles.timelineItem}>
                <View style={[
                    styles.timelineDot,
                    step.done && styles.timelineDotActive,
                  ]} />
                {i < steps.length - 1 && (
                  <View style={[
                      styles.timelineLine,
                      step.done && styles.timelineLineActive,
                    ]} />
                )}
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>{step.title}</Text>
                  {step.done && (
                    <Ionicons name="checkmark-circle" size={16} color="#7e22ce" />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Cargo Details Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('cargo_details')}</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}>
              <MaterialIcons name="inventory" size={24} color="#7e22ce" />
              <Text style={styles.detailLabel}>{t('type')}</Text>
              <Text style={styles.detailValue}>{cargo_type}</Text>
            </View>
            <View style={styles.detailBox}>
              <MaterialCommunityIcons name="dumbbell" size={24} color="#7e22ce" />
              <Text style={styles.detailLabel}>{t('weight')}</Text>
              <Text style={styles.detailValue}>{weight}</Text>
            </View>
            <View style={styles.detailBox}>
              <MaterialCommunityIcons name="truck" size={24} color="#7e22ce" />
              <Text style={styles.detailLabel}>{t('truck')}</Text>
              <Text style={styles.detailValue}>{truck_type}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Chat FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ContactSupport',{ shipmentId:id })}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f2f3f5' },
  center:    { flex:1, justifyContent:'center', alignItems:'center' },

  header: {
    flexDirection:    'row',
    alignItems:       'center',
    paddingTop:       48,
    paddingBottom:    12,
    paddingHorizontal:16,
    backgroundColor:  '#fff',
    elevation:        2,
  },
  backBtn:      { padding:4 },
  headerTitle:  { flex:1, fontSize:20, fontWeight:'600', textAlign:'center' },
  headerAction: { padding:4 },

  content:         { padding:16, paddingBottom:100 },
  card:            {
    backgroundColor:'#fff',
    borderRadius:   12,
    marginBottom:   16,
    elevation:      2,
    padding:        16,
  },

  mapRow:          { flexDirection:'row', alignItems:'center' },
  mapLabel:        { marginLeft:8, fontWeight:'500', color:'#333' },
  mapText:         { marginTop:4, color:'#555' },
  mapButton:       {
    marginTop:      16,
    alignSelf:      'flex-start',
    backgroundColor:'#7e22ce',
    paddingVertical:8,
    paddingHorizontal:12,
    borderRadius:   6,
  },
  mapButtonText:  { color:'#fff', fontWeight:'600' },

  sectionTitle:         { fontSize:18, fontWeight:'600', marginBottom:8 },
  statusBadgeContainer: { alignItems:'flex-start' },
  statusBadge:          {
    paddingHorizontal:12,
    paddingVertical: 6,
    borderRadius:    12,
    color:           '#fff',
    fontWeight:      '600',
  },
  badge_pending:        { backgroundColor:'#FFA500' },
  badge_in_progress:    { backgroundColor:'#007bff' },
  badge_delivered:      { backgroundColor:'#28a745' },

  timeline:             { marginTop:8 },
  timelineItem:         { flexDirection:'row', alignItems:'center', marginBottom:12 },
  timelineDot:          { width:12, height:12, borderRadius:6, backgroundColor:'#ccc' },
  timelineDotActive:    { backgroundColor:'#7e22ce' },
  timelineLine:         { width:2, flex:1, height:40, backgroundColor:'#ccc', marginHorizontal:6 },
  timelineLineActive:   { backgroundColor:'#7e22ce' },
  timelineContent:      { marginLeft:12, flexDirection:'row', alignItems:'center' },
  timelineLabel:        { fontSize:16, fontWeight:'500', marginRight:6 },

  detailsGrid:          { flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between' },
  detailBox:            {
    width:           '48%',
    backgroundColor: '#f9fbff',
    borderRadius:    10,
    padding:         12,
    alignItems:      'center',
    marginBottom:    12,
  },
  detailLabel:          { fontSize:14, color:'#555', marginTop:6 },
  detailValue:          { fontSize:16, fontWeight:'600', marginTop:4 },

  fab: {
    position:      'absolute',
    bottom:        24,
    right:         24,
    backgroundColor:'#7e22ce',
    width:         56,
    height:        56,
    borderRadius:  28,
    justifyContent:'center',
    alignItems:    'center',
    elevation:     5,
  },
});
