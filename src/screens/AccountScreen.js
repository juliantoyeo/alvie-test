import React from 'react';
import { Text, Button} from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { deleteToken } from '../store/actions/authActions'

class AccountScreen extends React.Component {
    constructor(props) {
        super(props);
    };
    onLogOut = async () => {
        await AsyncStorage.removeItem('token');
        this.props.deleteToken();
        this.props.navigation.navigate('BarCode');
    }
    render() {
        return (
            <SafeAreaView 
                forceInset = {{top: 'always'}}
                justifyContent= 'center'
                alignItems= 'center'
            >
                <Text style = {{fontSize: 48}}>Account Screen </Text>
                <Text style = {{fontSize: 48}}>{this.props.produitPhytoClicked}</Text>
                {console.log('nadir 23'+this.props.token)}
                
                <Button 
                    title='Logout'
                    onPress={this.onLogOut}
                />
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => {
    return {
      produitPhytoClicked: state.pulve.produitPhytoClicked,
      token: state.authen.token
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    deleteToken: () => dispatch(deleteToken())
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);