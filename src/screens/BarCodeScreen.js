import * as React from 'react';
import { View, AsyncStorage } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';
import { Content, Spinner, Icon, Button } from 'native-base';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { connect } from 'react-redux';
import { updateAuthInfo } from '../store/actions/authActions';
import { updatePhytoProductList } from '../store/actions/pulveActions'
import { signInWithBarCode, checkToken, storePushToken, getPhytoProducts } from '../api/hygoApi';
import { Notifications } from 'expo';
import { getLocationPermissionAsync } from '../geolocation'

import COLORS from '../colors'
import i18n from 'i18n-js';

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
    let {errorMessage, userName, familyName, deviceid, deviceType} = await checkToken(storedToken);

    if(!errorMessage) {
      await this.gotoNextScreen(storedToken, userName, familyName, deviceid, deviceType)
    } else {
      this.setState({ loading: false })
      this.getPermissionsAsync();
    }
  }

  gotoNextScreen = async (token, userName, familyName, deviceid, deviceType) => {
    await this.props.updateAuthInfo({
      token,
      userName, familyName, deviceid, deviceType
    })

    await AsyncStorage.setItem('token', token);

    // TODO debug this
    // await this.registerForPushNotificationsAsync(deviceid)

    this.props.navigation.navigate('mainFlow');
  }

  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({ tokenLoading: true });

    const {token, errorMessage, userName,familyName, deviceid, deviceType} = await signInWithBarCode(data);
    if(!errorMessage && token) {
      await this.gotoNextScreen(token, userName, familyName, deviceid, deviceType)
    } else {
      this.setState({ tokenLoading: false });
      this.setState({ scanned: true });
    }
  };

  render() {
    const { hasCameraPermission, scanned, tokenLoading } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }} forceInset={{top:'always'}}>
        { this.state.loading && (
          <Content contentContainerStyle={{ justifyContent: 'center', flex: 1, backgroundColor: COLORS.BEIGE }}>
            <Spinner color={COLORS.DARK_BLUE} />
          </Content>
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
  
              <Button transparent style={{ display: 'flex', height: 60, with: Dimensions.get('window').width }}
                onPress={() => this.getPermissionsAsync()} >
                <View style= {{
                  flex: 1,
                  display: 'flex',
                  height: 60,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.DARK_BLUE,
                  borderTopRightRadius: 40,
                  borderTopLeftRadius: 40,
                }}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Icon type="EvilIcons" name="refresh" style={{fontSize: 32, color: '#fff'}} />
                    <Text style={{
                      color: '#fff',
                      fontSize: 16,
                      fontFamily: 'nunito-bold',
                    }}>{i18n.t('bar_code.retry_camera')}</Text>
                  </View>
                </View>
                </Button>
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
            <Button transparent style={{ display: 'flex', height: 60, with: Dimensions.get('window').width }}
              onPress={() => this.setState({ scanned: false })} >
              <View style= {{
                flex: 1,
                display: 'flex',
                height: 60,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.DARK_BLUE,
                borderTopRightRadius: 40,
                borderTopLeftRadius: 40,
              }}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Icon type="EvilIcons" name="refresh" style={{fontSize: 32, color: '#fff'}} />
                  <Text style={{
                    color: '#fff',
                    fontSize: 16,
                    fontFamily: 'nunito-bold',
                  }}>{i18n.t('bar_code.retry_barcode')}</Text>
                </View>
              </View>
            </Button>
          )}
        </View>
      </SafeAreaView>     
    );
  }
}

BarCodeScreen.navigationOptions = () => {
  return {
      header: null
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  updateAuthInfo: (params) => dispatch(updateAuthInfo(params)),
  checkToken: (token) => dispatch(checkToken(token)),
  updatePhytoProductList: (l) => dispatch(updatePhytoProductList(l)),
})

export default connect(null, mapDispatchToProps)(BarCodeScreen);