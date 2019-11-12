import * as React from 'react';
import { View, AsyncStorage, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Text, Button} from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { connect } from 'react-redux';
import {updateToken, updateUserName} from '../store/actions/authActions';
import {signInWithBarCode, checkToken} from '../api/hygoApi';


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
      alert('erreur');
    }
    else {
      alert(`Hello ${userName}`);
      this.props.updateToken(token);
      await AsyncStorage.setItem('token', token);
      this.props.navigation.navigate('mainFlow');
    }
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
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
          borderColor: 'rgba(0, 0, 0, 0.5)',
          borderLeftWidth: Dimensions.get("window").width / 15,
          borderRightWidth: Dimensions.get("window").width / 15,
          borderTopWidth: Dimensions.get("window").width / 5,
          borderBottomWidth: Dimensions.get("window").width / 5,
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center'
          }}
        >
        {scanned && (
          <Button 
            title='Tap to Scan Again'
            onPress={() => this.setState({ scanned: false })} 
            buttonStyle= {{
              backgroundColor:'#8EE915'
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