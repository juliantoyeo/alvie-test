import * as React from 'react';
import { View, AsyncStorage, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Text,Button, colors} from 'react-native-elements';
import { Container, Content, Grid, Row, Col, H3 } from 'native-base';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { connect } from 'react-redux';
import {updateToken, updateUserName, updateFamilyName, updateDeviceid, updateDeviceType} from '../store/actions/authActions';
import {signInWithBarCode, checkToken, storePushToken} from '../api/hygoApi';
import HeaderHygo from '../components/HeaderHygo';
import { Notifications } from 'expo';


class BarCodeScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      hasCameraPermission: null,
      scanned: false,
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
    let storedToken = await AsyncStorage.getItem('token');
    let {errorMessage, userName, familyName, deviceid, deviceType} = await checkToken(storedToken);
    console.log(errorMessage);
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
    }
    else {
      this.getPermissionsAsync();
    }
  }

  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({ scanned: true });
    const {token, errorMessage, userName,familyName, deviceid, deviceType} = await signInWithBarCode(data);
    if(errorMessage || !token) {
      alert('QR code non reconnu');
    }
    else {
      alert(`Bonjour ${userName} ${familyName}`);
      this.props.updateToken(token);
      this.props.updateUserName(userName);
      this.props.updateFamilyName(familyName);
      this.props.updateDeviceid(deviceid);
      this.props.updateDeviceType(deviceType);
      console.log(token);
      await AsyncStorage.setItem('token', token);
      // newDate = new Date().getDate();
      // await AsyncStorage.setItem('dateSession',newDate);
      await this.registerForPushNotificationsAsync(deviceid)
      this.props.navigation.navigate('mainFlow');
    }
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text> Nous avons besoin d'avoir accès à l'appareil photo du téléphone pour scanner le capteur</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>Pas d'accès à l'appareil photo</Text>;
    }
    return (
        <SafeAreaView style={{ flex: 1 }} forceInset={{top:'always'}}>
              <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}>

                <BarCodeScanner
                  onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style= {{
                  height:Dimensions.get("window").height,
                  width:Dimensions.get("window").width,
                  borderColor: 'rgba(46, 88, 118, 0.5)',
                  borderLeftWidth: Dimensions.get("window").width / 15,
                  borderRightWidth: Dimensions.get("window").width / 15,
                  borderTopWidth: Dimensions.get("window").width / 3,
                  borderBottomWidth: Dimensions.get("window").width / 5,
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                  }}
                >
                <H3 style={{
                  position: 'absolute',
                  right: -10,
                  top: -50,
                  color:"white"

                }}
                >Bonjour, merci de scanner le QR code situé sur votre capteur Hygo </H3>
                {scanned && (
                  <Button 
                    title='Appuyer pour rescanner de nouveau le QR Code'
                    onPress={() => this.setState({ scanned: false })} 
                    buttonStyle= {{
                      backgroundColor:'#59DFD6'
                    }}
                  />
                )}
                </View>
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
  updateToken: (token) => dispatch(updateToken(token)),
  updateUserName: (userName) => dispatch(updateUserName(userName)),
  updateFamilyName:(familyName) => dispatch(updateFamilyName(familyName)),
  updateDeviceid:(deviceid) => dispatch(updateDeviceid(deviceid)),
  updateDeviceType:(deviceType) => dispatch(updateDeviceType(deviceType)),
  checkToken: (token) => dispatch(checkToken(token))
})

export default connect(null, mapDispatchToProps)(BarCodeScreen);