import React from 'react';
import { AsyncStorage } from 'react-native';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { deleteToken } from '../store/actions/authActions'
import HeaderHygo from '../components/HeaderHygo';
import UserAvatar from 'react-native-user-avatar';
import { SafeAreaView } from 'react-navigation';
import { Container, Content, Button, Icon, Text, H1,H3, Grid, Row, Col } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import pkg from '../../app.json'

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
            <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
                <Container>
                    <HeaderHygo/> 
                    <Content contentContainerStyle={{ flexGrow: 1}} style={{
                        backgroundColor:'#F6F6E9'
                    }}>
                        <Grid>
                            <Row size={10}></Row>
                            <Row size={30}>
                                <Col size={30} style={{
                                    justifyContent: 'center',
                                    alignItems:"flex-end",
                                    paddingRight: 5
                                }}>
                                    <UserAvatar size="70" name={`${this.props.userName} ${this.props.familyName}`|| "xx xx"} />
                                </Col>
                                <Col size={70} style={{
                                    justifyContent: 'space-around',
                                    alignItems: 'flex-start',
                                    padding: 5 
                                }}>
                                    <H1 style={{
                                        fontSize:30,
                                    }}>
                                        {`${this.props.userName} ${this.props.familyName}`}
                                    </H1>
                                </Col>
                            </Row>
                            <Row size={30}>
                                <Col>
                                    <Button full onPress={this.onLogOut} style={{backgroundColor:'#FF99A6'}}>
                                        <Icon type ="MaterialCommunityIcons" name="logout" />
                                        <Text>Se déconnecter</Text>
                                    </Button> 
                                </Col>
                            </Row>
                            <Row size={15} style={{
                                padding: 10, 
                            }}>
                                <Text style={styles.ecriture}>{`Un problème, une idée, n'hésitez pas à nous contacter`}</Text>
                            </Row>
                            <Row size={15}>
                                <Col size={20} style={{
                                    justifyContent: 'space-around',
                                    alignItems: 'center' 
                                }}>
                                    <Icon type ="FontAwesome" name="phone-square" fontSize={50} style={{color : '#194769', fontSize: 50}}/>
                                </Col>
                                <Col size={80} style={{
                                    justifyContent: 'space-around',
                                    alignItems: 'flex-start',
                                    paddingRight: 5
                                }}>
                                    <H3 style={styles.ecriture}> 06 68 48 38 83</H3>
                                </Col>   
                            </Row>
                            <Row size={15}>
                                <Col size={20} style={{
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                }}>
                                    <Icon type ="Entypo" name="mail" style={{color : '#194769', fontSize: 50}}/>
                                </Col>
                                <Col size={80}  style={{
                                    justifyContent: 'space-around',
                                    alignItems: 'flex-start',
                                    paddingRight: 5 
                                }}>
                                    <H3 style={styles.ecriture}> editab@alvie.fr</H3>
                                </Col>  
                            </Row>
                            <Row size={15}>
                                <Col size={80} style={styles.caracteristique}>
                                    <Text style={styles.ecriture}>{`Version applicative : ${pkg.expo.version}`}</Text>
                                    <Text style={styles.ecriture}>{`Modèle Capteur : ${this.props.deviceType}`}</Text>
                                    <Text style={styles.ecriture}>{`Numéro de serie du capteur : ${this.props.deviceid}`}</Text>
                                </Col>  
                            </Row>
                            <Row size={10}></Row>
                        </Grid>
                    </Content> 
                </Container> 
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    caracteristique: {
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingRight: 10,
        padding: 10, 
    },
    ecriture:{
        color : '#194769'
    },
    statusbar: {
        backgroundColor: '#F6F6E9',
        flex: 1
    } 
  });


const mapStateToProps = (state) => ({
      produitPhytoClicked: state.pulve.produitPhytoClicked,
      token: state.authen.token,
      userName: state.authen.userName,
      familyName: state.authen.familyName,
      deviceid : state.authen.deviceid,
      deviceType : state.authen.deviceType,
    }
);

  const mapDispatchToProps = (dispatch, props) => ({
    deleteToken: () => dispatch(deleteToken())
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);

 