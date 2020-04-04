import React from 'react'
import { StyleSheet, View, Text, Image, AsyncStorage, Linking } from 'react-native'
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { connect } from 'react-redux'
import { deleteToken } from '../store/actions/authActions'

import { Thumbnail } from 'native-base'
import pkg from '../../app.json'

import COLORS from '../colors'
import i18n from 'i18n-js'

const DrawerScreen = ({ navigation, deviceid, deviceType, userName, familyName, deleteToken }) => {
  const navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    navigation.dispatch(navigateAction);
    navigation.dispatch(DrawerActions.closeDrawer())
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
        <View style={styles.item}>
          <Image source={require('../../assets/parcelles.png')} style={styles.itemImage} />
          <Text style={styles.itemText}>{i18n.t('drawer.parcelles')}</Text>
        </View>
        <View style={styles.item}>
          <Image source={require('../../assets/contact.png')} style={styles.itemImage} />
          <Text style={styles.itemText} onPress={sendEmail}>{i18n.t('drawer.contact')}</Text>
        </View>
        <View style={styles.item}>
          <Image source={require('../../assets/logout.png')} style={styles.itemImage} />
          <Text style={styles.itemText} onPress={logout}>{i18n.t('drawer.logout')}</Text>
        </View>
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