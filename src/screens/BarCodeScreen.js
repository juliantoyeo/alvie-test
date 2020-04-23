import * as React from 'react';
import { StyleSheet, StatusBar, ImageBackground, View, AsyncStorage } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Text } from 'react-native-elements';
import { Content, Spinner } from 'native-base';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { connect } from 'react-redux';
import { updateAuthInfo } from '../store/actions/authActions';
import { updatePhytoProductList } from '../store/actions/pulveActions'
import { updateParcellesList, updateCulturesList } from '../store/actions/metaActions'
import { signInWithBarCode, checkToken, storePushToken, getPhytoProducts, getFields, getCultures } from '../api/hygoApi';
import { Notifications } from 'expo';
import { getLocationPermissionAsync } from '../geolocation'

import * as Device from 'expo-device';

import COLORS from '../colors'
import i18n from 'i18n-js';

import HygoButton from '../components/HygoButton'
import LogoLoading from '../components/LogoLoading'

class BarCodeScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      loading: true,
      tokenLoading: false,
    };
  }
  
  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    if (!Device.isDevice) {
      let code = await BarCodeScanner.scanFromURLAsync('https://alvie-mvp.s3-eu-west-1.amazonaws.com/qr-code8+(1).png')
      this.handleBarCodeScanned(code[0])
    }
  };

  registerForPushNotificationsAsync = async (deviceid) => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      return;
    }
    // Get the token that identifies this device
    const pushToken = await Notifications.getExpoPushTokenAsync();

    // POST the token to the backend server
    return storePushToken(pushToken, deviceid)
  }

  async componentDidMount() {
    await getLocationPermissionAsync()

    this.props.updatePhytoProductList(await getPhytoProducts())

    let storedToken = await AsyncStorage.getItem('token');
    let {errorMessage, userName, familyName, deviceid, deviceType, hasEquipment} = await checkToken(storedToken);

    if(!errorMessage) {
      await this.gotoNextScreen(storedToken, userName, familyName, deviceid, deviceType, hasEquipment)
    } else {
      this.setState({ loading: false })
      this.getPermissionsAsync();
    }
  }

  gotoNextScreen = async (token, userName, familyName, deviceid, deviceType, hasEquipment) => {
    await this.props.updateAuthInfo({
      token,
      userName, familyName, deviceid, deviceType
    })

    let [ fields, cultures ] = await Promise.all([
      getFields(),
      getCultures(),
    ])
    this.props.updateParcellesList(fields)
    this.props.updateCulturesList(cultures)

    await AsyncStorage.setItem('token', token);

    // TODO debug this
    // await this.registerForPushNotificationsAsync(deviceid)

    if (hasEquipment) {
      this.props.navigation.replace('main');
    } else {
      this.props.navigation.replace('BarCodeValidationScreen')
    }
  }

  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({ tokenLoading: true });

    const {token, errorMessage, userName,familyName, deviceid, deviceType, hasEquipment} = await signInWithBarCode(data);
    if(!errorMessage && token) {
      await this.gotoNextScreen(token, userName, familyName, deviceid, deviceType, hasEquipment)
    } else {
      this.setState({ tokenLoading: false });
      this.setState({ scanned: true });
    }
  };

  render() {
    const { hasCameraPermission, scanned, tokenLoading } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, display: 'flex' }}>
        { this.state.loading && (
          <>
          <StatusBar translucent backgroundColor="transparent" />
          <ImageBackground source={require('../../assets/blue_back.png')} imageStyle={{  resizeMode: 'cover', flex: 1 }} style={styles.container}>
            <View style={[StyleSheet.absoluteFill, { flex: 1, backgroundColor: '#000', opacity: .6 }]}></View>
            <View style={{ display: 'flex', alignItems: 'center' }}>
              <LogoLoading duration={1000} color={"#fff"} />
            </View>
          </ImageBackground>
          </>
        )}

        { !this.state.loading && hasCameraPermission === false && (
          <Content contentContainerStyle={{ justifyContent: 'center', flex: 1, padding: 20 }}>
            <Text style={{
              color: COLORS.DARK_BLUE,
              textAlign: 'center',
              fontSize: 24,
              fontFamily: 'nunito-regular'
            }}>{i18n.t('bar_code.camera_description')}</Text>

            <View style={[StyleSheet.absoluteFill, { 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'flex-end' }]}>
    
                <HygoButton onPress={() => this.getPermissionsAsync()} label={i18n.t('bar_code.retry_camera')} icon={{
                  type: 'EvilIcons',
                  name: 'refresh'
                }} />
            </View>
          </Content>
        )}
        
        { !this.state.loading && hasCameraPermission && (
          <BarCodeScanner
            onBarCodeScanned={scanned || tokenLoading ? undefined : this.handleBarCodeScanned}
            style={[StyleSheet.absoluteFill, {display: 'flex'}]}>
              <View style={{ 
                backgroundColor: COLORS.BEIGE, 
                flex: 1, 
                display: 'flex', 
                flexDirection:'row',
                alignItems:'center',
                padding: 36,
                paddingTop: 90,
                justifyContent:'center' }}>

                <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <Text textAlign="center" style={{
                    color: COLORS.DARK_BLUE,
                    textAlign: 'center',
                    fontSize: 24,
                    flex: 1,
                    fontFamily: 'nunito-regular'
                  }}>{i18n.t('bar_code.welcome')}</Text>

                  <Text textAlign="center" style={{
                    color: COLORS.DARK_GREEN,
                    textAlign: 'center',
                    fontSize: 18,
                    flex: 1,
                    fontFamily: 'nunito-regular'
                  }}>{i18n.t('bar_code.notice')}</Text>
                </View>
              </View>
              <View style={{ height: 300, display: 'flex', flexDirection: 'row', backgroundColor: tokenLoading ? '#000' : 'transparent' }}>
                <View style={{ backgroundColor: COLORS.BEIGE, flex: 1 }}></View>
                <View style={{ backgroundColor: scanned || tokenLoading ? 'rgba(255, 255, 255, .6)' : 'transparent', flexDirection: 'column', width: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  { scanned && (
                    <Text textAlign="center" style={{
                      color: COLORS.DARK_BLUE,
                      textAlign: 'center',
                      fontSize: 24,
                      fontFamily: 'nunito-bold'
                    }}>{i18n.t('bar_code.qr_error')}</Text>
                  )}

                  { tokenLoading && (
                    <Spinner color={COLORS.DARK_BLUE} />
                  )}
                </View>
                <View style={{ backgroundColor: COLORS.BEIGE, flex: 1 }}></View>
              </View>
              <View style={{ backgroundColor: COLORS.BEIGE, height: 90 }} />
          </BarCodeScanner>
        )}

        <View style={[StyleSheet.absoluteFill, { 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'flex-end' }]}>

          {scanned && (
            <HygoButton onPress={() => this.setState({ scanned: false })} label={i18n.t('bar_code.retry_barcode')} icon={{
              type: 'EvilIcons',
              name: 'refresh'
            }} />
          )}
        </View>
      </SafeAreaView>     
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    justifyContent: 'center', 
    flex: 1, 
    display: 'flex', 
    paddingLeft: 38, 
    paddingRight: 38, 
    alignItems: 'center',
    resizeMode: 'cover'
  },
})

BarCodeScreen.navigationOptions = () => {
  return {
      header: null
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  updateAuthInfo: (params) => dispatch(updateAuthInfo(params)),
  checkToken: (token) => dispatch(checkToken(token)),
  updatePhytoProductList: (l) => dispatch(updatePhytoProductList(l)),
  updateParcellesList: (l) => dispatch(updateParcellesList(l)),
  updateCulturesList: (l) => dispatch(updateCulturesList(l)),
})

export default connect(null, mapDispatchToProps)(BarCodeScreen);