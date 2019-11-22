import * as React from 'react';
import { View, AsyncStorage, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Text,Button, colors} from 'react-native-elements';
import { Container, Content, Grid, Row, Col, H3 } from 'native-base';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { connect } from 'react-redux';
import {updateToken, updateUserName} from '../store/actions/authActions';
import {signInWithBarCode, checkToken} from '../api/hygoApi';
import HeaderHygo from '../components/HeaderHygo';


class BarCodeScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  async componentWillMount() {
    const storedToken = await AsyncStorage.getItem('token');
    
    const {errorMessage, userName} = await checkToken(storedToken);
    
    
    if(!errorMessage) {
      this.setState({scanned: true})
      this.props.updateToken(storedToken);
      this.props.updateUserName(userName);
      alert(`Bonjour ${userName}`);
      this.props.navigation.navigate('mainFlow');
    }
    else {
      this.getPermissionsAsync();
    }
  }

  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({ scanned: true });
    const {token, errorMessage, userName} = await signInWithBarCode(data);
    if(errorMessage || !token) {
      alert('QR code non reconnu');
    }
    else {
      alert(`Bonjour ${userName}`);
      this.props.updateToken(token);
      await AsyncStorage.setItem('token', token);
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
                  borderTopWidth: Dimensions.get("window").width / 4,
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
          
    );
  }
}

BarCodeScreen.navigationOptions = () => {
  return {
      header: null
  }
}

const mapStateToProps = ({token}) => ({
  token
});
const mapDispatchToProps = (dispatch, props) => ({
  updateToken: (token) => dispatch(updateToken(token)),
  updateUserName: (userName) => dispatch(updateUserName(userName)),
  checkToken: (token) => dispatch(checkToken(token))
})

export default connect(mapStateToProps, mapDispatchToProps)(BarCodeScreen);