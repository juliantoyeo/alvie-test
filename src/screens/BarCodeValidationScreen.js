import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { Content } from 'native-base';

import COLORS from '../colors';
import i18n from 'i18n-js';

import HygoButton from '../components/HygoButton'

const BarCodeValidationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.statusbar} forceInset={{top: 'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
        <Content contentContainerStyle={styles.container}>
          <View style={{ flex: 2 }} />
          <Text textAlign="center" style={styles.title}>{i18n.t('barcode_validation.title_notice')}</Text>
          <Text textAlign="center" style={styles.text}>{i18n.t('barcode_validation.text_notice_1')}</Text>
          <Text textAlign="center" style={styles.text}>{i18n.t('barcode_validation.text_notice_2')}</Text>
          <View style={{ flex: 2 }} />

          <View style={[StyleSheet.absoluteFill, styles.buttonView]}>
            <HygoButton onPress={() => {
              navigation.replace('EquipmentSettingsScreen')
            }} label={i18n.t('button.next')} icon={{
              type: 'AntDesign',
              name: 'arrowright',
              fontSize: 26
            }} />
          </View>
        </Content>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statusbar: { backgroundColor: COLORS.BEIGE, flex: 1 },
  container: { justifyContent: 'center', flex: 1, display: 'flex', paddingLeft: 38, paddingRight: 38, alignItems: 'center' },
  containerSelect: { justifyContent: 'flex-start', flex: 1, display: 'flex', paddingLeft: 0, paddingRight: 15, backgroundColor: COLORS.BEIGE },
  title: {
    color: COLORS.DARK_BLUE,
    textAlign: 'center',
    fontSize: 24,
    flex: 1,
    fontFamily: 'nunito-regular'
  },
  loading: {
    color: COLORS.DARK_BLUE,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'nunito-regular'
  },
  text: {
    color: COLORS.DARK_GREEN,
    textAlign: 'center',
    fontSize: 18,
    flex: 1,
    fontFamily: 'nunito-regular'
  },
  buttonView: { 
    display: 'flex', 
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'flex-end' 
  },
});

export default BarCodeValidationScreen;
