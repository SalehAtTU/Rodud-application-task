import React, { useState } from 'react';
import {
  LogBox,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

import { Ionicons }                from '@expo/vector-icons';
import { MaterialCommunityIcons }   from '@expo/vector-icons';
import DropDownPicker               from 'react-native-dropdown-picker';
import api                          from '../api/axios';
import { t }                        from '../i18n';

export default function NewShipmentScreen({ navigation }) {
  const [pickup, setPickup]   = useState({ coords:null, address:'' });
  const [dropoff, setDropoff] = useState({ coords:null, address:'' });

  const [cargoOpen, setCargoOpen]   = useState(false);
  const [cargoType, setCargoType]   = useState(null);
  const cargoItems = [
    { label: t('general_goods'), value:'general' },
    { label: t('fragile'),       value:'fragile' },
    { label: t('perishable'),    value:'perishable' },
  ];

  const [weightOpen, setWeightOpen]   = useState(false);
  const [cargoWeight, setCargoWeight] = useState(null);
  const weightItems = [
    { label:'1 – 10 Tons',  value:'1-10' },
    { label:'11 – 20 Tons', value:'11-20' },
    { label:'21 – 30 Tons', value:'21-30' },
  ];

  const truckTypes = [
    { key:'flatbed',  label:t('trailer_flatbed'),    image:require('../../assets/flatbed.png') },
    { key:'curtain',  label:t('trailer_curtain'),    image:require('../../assets/curtain.png') },
    { key:'highside', label:t('trailer_high_sides'), image:require('../../assets/trailerhigh.png') },
    { key:'tank',     label:t('trailer_tanker'),     image:require('../../assets/trailershort.png') },
  ];
  const [truckType, setTruckType] = useState(null);

  const onSubmit = async () => {
    if (
      !pickup.coords ||
      !dropoff.coords ||
      !cargoType ||
      !cargoWeight ||
      !truckType
    ) {
      return Alert.alert(t('error'), t('please_fill_in_all_required_fields'));
    }

    const payload = {
      pickup_address:    pickup.address,
      pickup_latitude:   pickup.coords.latitude,
      pickup_longitude:  pickup.coords.longitude,
      dropoff_address:   dropoff.address,
      dropoff_latitude:  dropoff.coords.latitude,
      dropoff_longitude: dropoff.coords.longitude,
      cargo_type:        cargoType,
      weight:            cargoWeight,
      truck_type:        truckType,
      pickup_date:       new Date().toISOString(),
      dropoff_date:      new Date().toISOString(),
    };

    try {
      await api.post('/shipments', payload);
      Alert.alert(t('success'), t('order_submitted'));
      navigation.goBack();
    } catch (err) {
      console.error(err.response?.data || err);
      Alert.alert(t('error'), t('could_not_create_order'));
    }
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('new_shipment')}</Text>
      </View>

      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.content}>
        {/* pickup */}
        <Text style={styles.label}>{t('pickup')} *</Text>
        <TouchableOpacity
          style={[styles.input, !pickup.address && styles.placeholder]}
          onPress={() =>
            navigation.push('MapPicker', {
              onPick: loc => setPickup(loc),
              title: t('select_pickup_location'),
            })
          }
        >
          <Text style={{ color: pickup.address ? '#000':'#999' }}>
            {pickup.address || t('search_pickup_location')}
          </Text>
          <Ionicons name="chevron-down-outline" size={20} color="#999" />
        </TouchableOpacity>

        {/* dropoff */}
        <Text style={styles.label}>{t('dropoff')} *</Text>
        <TouchableOpacity
          style={[styles.input, !dropoff.address && styles.placeholder]}
          onPress={() =>
            navigation.push('MapPicker', {
              onPick: loc => setDropoff(loc),
              title: t('select_dropoff_location'),
            })
          }
        >
          <Text style={{ color: dropoff.address ? '#000':'#999' }}>
            {dropoff.address || t('search_dropoff_location')}
          </Text>
          <Ionicons name="chevron-down-outline" size={20} color="#999" />
        </TouchableOpacity>

        {/* cargo type */}
        <Text style={styles.label}>{t('cargo_type')} *</Text>
        <View style={[styles.dropdownWrapper, { zIndex:3000 }]}>
          <DropDownPicker
            open={cargoOpen}
            value={cargoType}
            items={cargoItems}
            setOpen={setCargoOpen}
            setValue={setCargoType}
            placeholder={t('select_cargo_type')}
            style={styles.input}
            dropDownContainerStyle={styles.dropDownContainer}
          />
        </View>

        {/* cargo weight */}
        <Text style={styles.label}>{t('cargo_weight')} *</Text>
        <View style={[styles.dropdownWrapper, { zIndex:2000 }]}>
          <DropDownPicker
            open={weightOpen}
            value={cargoWeight}
            items={weightItems}
            setOpen={setWeightOpen}
            setValue={setCargoWeight}
            placeholder={t('select_cargo_weight')}
            style={styles.input}
            dropDownContainerStyle={styles.dropDownContainer}
          />
        </View>

        {/* truck types */}
        <Text style={styles.label}>{t('truck_types')} *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.truckScroll}>
          {truckTypes.map(tpe => (
            <TouchableOpacity
              key={tpe.key}
              style={[
                styles.truckCard,
                truckType === tpe.key && styles.truckCardActive
              ]}
              onPress={() => setTruckType(tpe.key)}
            >
              <Image source={tpe.image} style={styles.truckImage} />
              <Text style={styles.truckLabel}>{tpe.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
          <Text style={styles.submitText}>{t('create_order')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /* … your existing styles … */
  container:           { flex:1, backgroundColor:'#fff' },
  header:              {
                         flexDirection:'row',
                         alignItems:'center',
                         paddingHorizontal:16,
                         paddingTop:48,
                         paddingBottom:12,
                         backgroundColor:'#fff',
                         borderBottomWidth:1,
                         borderColor:'#eee',
                       },
  backButton:          { padding:4 },
  headerTitle:         { fontSize:20, fontWeight:'600', marginLeft:12 },

  contentContainer:    { flex:1 },
  content:             { padding:16, paddingBottom:32 },

  label:               { fontSize:16, fontWeight:'600', marginBottom:8, color:'#333' },

  input: {
    backgroundColor:'#f7f7f7',
    borderRadius:8,
    borderWidth:1,
    borderColor:'#e0e0e0',
    padding:12,
    marginBottom:20,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  placeholder:         { borderStyle:'dashed', borderColor:'#999' },

  dropdownWrapper:     { marginBottom:20 },
  dropDownContainer:   {
                         backgroundColor:'#f7f7f7',
                         borderRadius:8,
                         borderWidth:1,
                         borderColor:'#e0e0e0',
                       },

  truckScroll:         { marginVertical:10 },
  truckCard:           {
                         width:100,
                         height:100,
                         borderRadius:8,
                         borderWidth:2,
                         borderColor:'#e0e0e0',
                         marginRight:12,
                         justifyContent:'center',
                         alignItems:'center',
                       },
  truckCardActive:     { borderColor:'#7e22ce' },
  truckImage:          { width:50, height:50, resizeMode:'contain', marginBottom:6 },
  truckLabel:          { fontSize:12, textAlign:'center' },

  submitBtn:           {
                         backgroundColor:'#7e22ce',
                         padding:16,
                         borderRadius:8,
                         alignItems:'center',
                         marginTop:16,
                       },
  submitText:          { color:'#fff', fontSize:16, fontWeight:'600' },
});
