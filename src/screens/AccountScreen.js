import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { deleteToken } from '../store/actions/authActions'
import HeaderHygo from '../components/HeaderHygo';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body, Icon, Text, H1 } from 'native-base';

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
            <Container>
                <HeaderHygo/>  
                    <SafeAreaView 
                        forceInset = {{top: 'always'}}
                        justifyContent= 'center'
                        alignItems= 'center'
                    >
                        <Text style = {{fontSize: 48}}>Account Screen </Text>
                        <Text style = {{fontSize: 48}}>{this.props.produitPhytoClicked}</Text>
                        
                        <Button 
                            title='Logout'
                            onPress={this.onLogOut}
                        />
                    </SafeAreaView>
            </Container> 
            
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