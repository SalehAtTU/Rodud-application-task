// src/screens/ContactSupportScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../i18n';

export default function ContactSupportScreen({ route, navigation }) {
  const shipmentId = route.params?.shipmentId;
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (!message.trim()) {
      return Alert.alert(t('error'), t('please_enter_message'));
    }

    const to      = 'saleh.aljohani.cs@gmail.com';
    const subject = shipmentId
      ? `${t('support_request_for')} #${shipmentId}`
      : t('support_request');
    const body    = message;

    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url)
      .then(() => {
        Alert.alert(t('opened_mail_app'), t('compose_email'));
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert(t('error'), t('could_not_open_mail'));
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('contact_support')}</Text>
      </View>

      {shipmentId != null && (
        <Text style={styles.subtext}>
          {t('order')} #{shipmentId}
        </Text>
      )}

      <TextInput
        style={styles.textarea}
        placeholder={t('type_your_message')}
        multiline
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity style={styles.button} onPress={sendMessage}>
        <Text style={styles.buttonText}>{t('send')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex:1, backgroundColor:'#fff', padding:20 },
  header:     { flexDirection:'row', alignItems:'center', marginBottom:20 },
  title:      { fontSize:20, fontWeight:'600', marginLeft:12 },
  subtext:    { fontSize:14, color:'#666', marginBottom:20 },
  textarea:   {
                flex:1,
                textAlignVertical:'top',
                borderWidth:1,
                borderColor:'#ddd',
                borderRadius:8,
                padding:12,
                marginBottom:20,
              },
  button:     {
                backgroundColor:'#7e22ce',
                padding:15,
                borderRadius:8,
                alignItems:'center',
              },
  buttonText: { color:'#fff', fontSize:16, fontWeight:'600' },
});
