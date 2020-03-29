import * as React from 'react';
import { View, AsyncStorage } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Content, Spinner } from 'native-base';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { connect } from 'react-redux';
import {updateToken, updateUserName, updateFamilyName, updateDeviceid, updateDeviceType} from '../store/actions/authActions';
import {signInWithBarCode, checkToken, storePushToken} from '../api/hygoApi';
import { Notifications } from 'expo';
import { getLocationPermissionAsync } from '../geolocation'

class BarCodeScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      loading: true,
    };
  }
  
  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  registerForPushNotificationsAsync = async (deviceid) => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      alert('No notification permissions!');
      return;
    }
    // Get the token that identifies this device
    const pushToken = await Notifications.getExpoPushTokenAsync();
    // POST the token to the backend server
    return storePushToken(pushToken, deviceid)
  }

  async componentDidMount() {
    await getLocationPermissionAsync()

    let storedToken = await AsyncStorage.getItem('token');
    let {errorMessage, userName, familyName, deviceid, deviceType} = await checkToken(storedToken);

    /* Uncomment to use with a simulator
    storedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTc0NjkwNTEwfQ.BMPyYhJeZHnB3YXGTeRGg20COa40OHCkgINoCZ0h5b0";
    errorMessage = null;
    userName = "Albert";
    familyName = 'Gall'
    deviceid ='BE4A68'
    deviceType ='HYGO Lite'
    //*/

    if(!errorMessage) {
      this.setState({scanned: true});

      this.props.updateToken(storedToken);
      this.props.updateUserName(userName);
      this.props.updateFamilyName(familyName);
      this.props.updateDeviceid(deviceid);
      this.props.updateDeviceType(deviceType);
      await this.registerForPushNotificationsAsync(deviceid)

      this.props.navigation.navigate('mainFlow');
    } else {
      this.setState({ loading: false })
      this.getPermissionsAsync();
    }
  }

  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({ scanned: true });

    const {token, errorMessage, userName,familyName, deviceid, deviceType} = await signInWithBarCode(data);
    if(errorMessage || !token) {
      alert('QR code non reconnu');
    } else {
      alert(`Bonjour ${userName} ${familyName}`);

      this.props.updateToken(token);
      this.props.updateUserName(userName);
      this.props.updateFamilyName(familyName);
      this.props.updateDeviceid(deviceid);
      this.props.updateDeviceType(deviceType);

      await AsyncStorage.setItem('token', token);
      
      await this.registerForPushNotificationsAsync(deviceid)
      this.props.navigation.navigate('mainFlow');
    }
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }} forceInset={{top:'always'}}>
        { this.state.loading && (
          <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
            <Spinner color='#194769' />
          </Content>
        )}

        { !this.state.loading && hasCameraPermission === false && (
          <Content contentContainerStyle={{ justifyContent: 'center', flex: 1, padding: 20 }}>
            <Text style={{
              textAlign: 'center',
              fontSize: 18,
              marginBottom: 20
            }}>Nous avons besoin d'avoir accès à l'appareil photo du téléphone pour scanner le capteur</Text>

            <Button 
              title='Essayer à nouveau'
              onPress={() => this.getPermissionsAsync()} 
              buttonStyle= {{
                backgroundColor:'#59DFD6',
              }} />
          </Content>
        )}
        
        { !this.state.loading && hasCameraPermission && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}>

            <View style={{ flex: 1, padding: 20, backgroundColor: 'rgba(46, 88, 118, 0.5)', display: 'flex' }}>
              <Text textAlign="center" style={{
                color:"white",
                textAlign: 'center',
                fontSize: 18,
              }}>Bonjour, merci de scanner le QR code situé sur votre capteur Hygo </Text>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                style={{ flex: 1 }}
              />

              {scanned && (
                <View style={[StyleSheet.absoluteFill, { 
                  padding: 20, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' }]}>

                  <Button 
                    title='Appuyer pour rescanner de nouveau le QR Code'
                    onPress={() => this.setState({ scanned: false })} 
                    buttonStyle= {{
                      backgroundColor:'#59DFD6',
                    }} />
                </View>
              )}
            </View>
          </View>
        )}
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
  updateToken: (token) => dispatch(updateToken(token)),
  updateUserName: (userName) => dispatch(updateUserName(userName)),
  updateFamilyName:(familyName) => dispatch(updateFamilyName(familyName)),
  updateDeviceid:(deviceid) => dispatch(updateDeviceid(deviceid)),
  updateDeviceType:(deviceType) => dispatch(updateDeviceType(deviceType)),
  checkToken: (token) => dispatch(checkToken(token))
})

export default connect(null, mapDispatchToProps)(BarCodeScreen);