// src/screens/MapPickerScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function MapPickerScreen({ navigation, route }) {
  const { onPick, title } = route.params;
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState('');

  // get user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location.');
        return;
      }
      let { coords } = await Location.getCurrentPositionAsync();
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  // reverse geocode
  const onRegionChangeComplete = async (rgn) => {
    setRegion(rgn);
    try {
      const [rev] = await Location.reverseGeocodeAsync(rgn);
      setAddress(
        `${rev.name||''} ${rev.street||''}, ${rev.city||''}`.trim()
      );
    } catch {
      setAddress('');
    }
  };

  const onConfirm = () => {
    onPick({ coords: region, address });
    navigation.goBack();
  };

  if (!region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7e22ce"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        <Marker coordinate={region}/>
      </MapView>

      <View style={styles.addressBox}>
        <Ionicons name="location-outline" size={20} color="#7e22ce"/>
        <Text style={styles.addressText} numberOfLines={1}>
          {address || 'Move map to select'}
        </Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={onConfirm}>
        <Text style={styles.btnText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1},
  map:{flex:1},
  center:{flex:1,justifyContent:'center',alignItems:'center'},
  addressBox:{
    position:'absolute', top:20, left:20, right:20,
    backgroundColor:'#fff', flexDirection:'row',alignItems:'center',
    padding:10, borderRadius:10, elevation:4
  },
  addressText:{marginLeft:8,flex:1},
  btn:{
    position:'absolute', bottom:30, left:20, right:20,
    backgroundColor:'#7e22ce',padding:15, borderRadius:10,alignItems:'center'
  },
  btnText:{color:'#fff',fontSize:16,fontWeight:'bold'},
});
