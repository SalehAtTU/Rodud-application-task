// src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer }         from '@react-navigation/native';
import { createDrawerNavigator }       from '@react-navigation/drawer';
import { createStackNavigator }        from '@react-navigation/stack';
import AsyncStorage                    from '@react-native-async-storage/async-storage';
import { t }                           from '../i18n';

// Auth & User screens
import LoginScreen            from '../screens/LoginScreen';
import RegisterScreen         from '../screens/RegisterScreen';
import MyShipmentsScreen      from '../screens/MyShipmentsScreen';
import NewShipmentScreen      from '../screens/NewShipmentScreen';
import ShipmentDetailsScreen  from '../screens/ShipmentDetailsScreen';
import MapPickerScreen from '../screens/MapPickerScreen';
import ProfileScreen          from '../screens/ProfileScreen';
import ContactSupportScreen   from '../screens/ContactSupportScreen';

// Admin screens
import AdminOrdersScreen       from '../screens/AdminOrdersScreen';
import AdminOrderDetailsScreen from '../screens/AdminOrderDetailsScreen';

// Custom sidebar
import CustomDrawerContent    from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();
const Stack  = createStackNavigator();

function ShipmentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyShipments"     component={MyShipmentsScreen} />
      <Stack.Screen name="NewShipment"     component={NewShipmentScreen} />
      <Stack.Screen name="ShipmentDetails" component={ShipmentDetailsScreen} />
      <Stack.Screen name="MapPicker"       component={MapPickerScreen} />
      <Stack.Screen name="ContactSupport"  component={ContactSupportScreen} />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminOrders"       component={AdminOrdersScreen} />
      <Stack.Screen name="AdminOrderDetails" component={AdminOrderDetailsScreen} />
      <Stack.Screen name="ContactSupport"    component={ContactSupportScreen} />
    </Stack.Navigator>
  );
}

function AppDrawer() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('userData')
      .then(json => setUser(json ? JSON.parse(json) : null))
      .catch(console.error);
  }, []);

  if (user === null) return null;

  return (
    <Drawer.Navigator
      initialRouteName={user.is_admin ? 'Admin' : 'Shipments'}
      drawerContent={props => <CustomDrawerContent {...props} user={user} />}
      screenOptions={{ headerShown: false }}
    >
      {!user.is_admin && (
        <Drawer.Screen name="Shipments" component={ShipmentStack} />
      )}
      {user.is_admin && (
        <Drawer.Screen name="Admin" component={AdminStack} />
      )}
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      {/* Make ContactSupport available at top level too */}
      <Drawer.Screen
        name="ContactSupport"
        component={ContactSupportScreen}
        options={{ title: t('contact_support') }}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth flow */}
        <Stack.Screen name="Login"    component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/* Main app */}
        <Stack.Screen name="App"      component={AppDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
