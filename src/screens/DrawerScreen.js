import React from 'react'
import { StyleSheet, View, Text, Image, AsyncStorage, Linking, TouchableOpacity } from 'react-native'
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { connect } from 'react-redux'
import { deleteToken } from '../store/actions/authActions'

import { Thumbnail } from 'native-base'
import pkg from '../../app.json'

import COLORS from '../colors'
import i18n from 'i18n-js'

import { getEquipment, getFields } from '../api/hygoApi'

const DrawerScreen = ({ navigation, deviceid, deviceType, userName, familyName, deleteToken }) => {
  const goToEquipment = () => {
    navigation.dispatch(DrawerActions.closeDrawer())
    navigation.navigate('LoadingScreen', {
      next: 'EquipmentSettingsScreen',
      params: {},
      action: getEquipment
    })
  }

  const goToFields = () => {
    navigation.dispatch(DrawerActions.closeDrawer())
    navigation.navigate('FieldsScreen')
  }

  const logout = async () => {
    await AsyncStorage.removeItem('token');

    deleteToken();
    
    navigation.navigate('BarCode');
  }

  const sendEmail = () => {
    const email = 'editab@alvie.fr'
    const subject = i18n.t('drawer.email_subject')
    const body = `
    
    ----
    ${i18n.t('drawer.app_version', { version: pkg.expo.version })}<br>
    ${i18n.t('drawer.hygo_model', { model: deviceType })}<br>
    ${i18n.t('drawer.hygo_serial', { serial: deviceid })}
    `

    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Thumbnail source={require('../../assets/farmer-icon-png-10-transparent.png')} circular />
        <Text style={[styles.topText, { marginTop: 10}]}>{`${userName} ${familyName}`}</Text>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.item}  onPress={() => goToFields()}>
          <Image source={require('../../assets/parcelles.png')} style={styles.itemImage} />
          <Text style={styles.itemText}>{i18n.t('drawer.parcelles')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => goToEquipment()}>
          <Image source={require('../../assets/ICN-Nav2.png')} style={styles.itemImage} />
          <Text style={styles.itemText}>{i18n.t('drawer.equipment')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={sendEmail}>
          <Image source={require('../../assets/contact.png')} style={styles.itemImage} />
          <Text style={styles.itemText}>{i18n.t('drawer.contact')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={logout}>
          <Image source={require('../../assets/logout.png')} style={styles.itemImage} />
          <Text style={styles.itemText}>{i18n.t('drawer.logout')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/hygo.png')} style={styles.logo} />
        <Text style={styles.btmText}>{`${i18n.t('drawer.app_version', { version: pkg.expo.version })}`}</Text>
        <Text style={styles.btmText}>{`${i18n.t('drawer.hygo_model', { model: deviceType })}`}</Text>
        <Text style={styles.btmText}>{`${i18n.t('drawer.hygo_serial', { serial: deviceid })}`}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    backgroundColor: COLORS.CYAN,
    flex: 1
  },
  top: {
    backgroundColor: COLORS.CYAN,
    padding: 15,
  },
  topText: {
    fontFamily: 'nunito-regular',
    color: '#fff',
    fontSize: 16
  },
  btmText: {
    fontFamily: 'nunito-regular',
    color: COLORS.DARK_BLUE,
    fontSize: 14
  },
  bottom: {
    backgroundColor: '#fff',
    flex: 1
  },
  item: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemImage: {
    tintColor: '#aaaaaa',
    width: 20,
    marginRight: 36
  },
  itemText: {
    color: COLORS.DARK_BLUE,
    textTransform: 'uppercase',
    fontSize: 16,
    fontFamily: 'nunito-bold'
  },
  logoContainer: {
    paddingBottom: 30,
    paddingLeft: 20,
    backgroundColor: '#fff'
  },
  logo: { 
    tintColor: COLORS.DARK_BLUE,
    marginBottom: 10,
  }
})

const mapStateToProps = (state) => ({
  deviceid: state.authen.deviceid,
  deviceType: state.authen.deviceType,
  userName: state.authen.userName,
  familyName: state.authen.familyName
});

const mapDispatchToProps = (dispatch, props) => ({
  deleteToken: () => dispatch(deleteToken())
})

export default connect(mapStateToProps, mapDispatchToProps)(DrawerScreen);