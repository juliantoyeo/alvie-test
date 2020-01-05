import React from 'react';
import { AsyncStorage } from 'react-native';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { deleteToken } from '../store/actions/authActions'
import HeaderHygo from '../components/HeaderHygo';
import { ProductList } from '../components/ProductList';
import UserAvatar from 'react-native-user-avatar';
import { SafeAreaView } from 'react-navigation';
import { Container, Switch, ListItem, List, Content, Left, Right, Button, H2, Form, Icon, Body, Text, H1,H3, Grid, Row, Col } from 'native-base';

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
            <SafeAreaView style={{ flex: 1 }} forceInset={{top:'always'}}>
            <Container>
                <HeaderHygo/> 
                <Content contentContainerStyle={{ flexGrow: 1}}
                style ={
                    {
                    backgroundColor:'#F6F6E9',
                    }
                    }>
                    <Grid>
                        <Row size={10}>
                        </Row>
                        <Row size={30}>
                            <Col size={30} style ={
                                {
                                justifyContent: 'center',
                                alignItems:"flex-end",
                                paddingRight: 5
                                }
                                }>
                                <UserAvatar size="70" name={`${this.props.userName} ${this.props.familyName}`|| "xx xx"} />
                            </Col>
                            <Col size={70} style ={
                                {
                                justifyContent: 'space-around',
                                alignItems: 'flex-start',
                                padding: 5 
                                }
                                }>
                                <H1 style={
                                    {
                                    fontSize:30,
                                    }
                                    }>
                                    {`${this.props.userName} ${this.props.familyName}`}
                                </H1>
                            </Col>
                        </Row>
                                {/*<Row size={30} style ={{
                            justifyContent: 'space-around',
                            
                            padding: 5 
                            }}
                        >
                        <List>
                        
                            <ListItem icon>
                                <Left>
                                    <Button style={{ backgroundColor: "#194769" }}>
                                        <Icon active name="ios-notifications" />
                                    </Button>
                                </Left>
                                <Text>Notification Changement </Text>
                                <Right>
                                    <Switch value={false} />
                                </Right>
                            </ListItem>
                            </List> 
                        </Row>*/}
                        <Row size={30}>
                            <Col>
                            <Button full
                                onPress={this.onLogOut}
                                style={{backgroundColor:'#FF99A6'}}
                                >
                                <Icon type ="MaterialCommunityIcons" name="logout" />
                                <Text>Se déconnecter</Text>
                            </Button> 
                            </Col>
                        </Row>
                       
                        <Row size={15} style ={
                            {
                            padding: 10, 
                            }}>
                            <Text style={styles.ecriture}> Un problème, une idée, n'hésitez pas à nous contacter</Text>
                        </Row>
                        <Row size={15}>
                            <Col size={20} style ={
                                {
                                justifyContent: 'space-around',
                                alignItems: 'flex-end' 
                                }
                                }>
                                <Icon type ="FontAwesome" name="phone-square" style={{color : '#194769', fontSize: 50}}/>
                            </Col>
                            <Col size={80}style ={
                                {
                                justifyContent: 'space-around',
                                alignItems: 'flex-start',
                                paddingRight: 5
                                }
                                }>
                                <H3 style={styles.ecriture}> 06 68 48 38 83</H3>
                            </Col>   
                        </Row>
                        <Row size={15}>
                            <Col size={20} style ={
                                {
                                justifyContent: 'space-around',
                                alignItems: 'flex-end' 
                                }
                                }>
                                <Icon type ="Entypo" name="mail" style={{color : '#194769', fontSize: 50}}/>
                            </Col>
                            <Col size={80}  style ={
                                {
                                justifyContent: 'space-around',
                                alignItems: 'flex-start',
                                paddingRight: 5 
                                }
                                }>
                                <H3 style={styles.ecriture}> editab@alvie.fr</H3>
                            </Col>  
                        </Row>
                        <Row size={15}>
                            <Col size={80} style={styles.caracteristique} 
                                >
                                <Text style={styles.ecriture}> Version applicative : 1.0.1 </Text>
                                <Text style={styles.ecriture}> Modèle Capteur : {`${this.props.deviceType}`}</Text>
                                <Text style={styles.ecriture}> Numéro de serie du capteur : {`${this.props.deviceid}`}</Text>
                            </Col>  
                        </Row>
                        {/*<Row size={15}>
                            <Col size={80}  style ={
                                {
                                justifyContent: 'space-around',
                                alignItems: 'flex-start',
                                paddingRight: 5 
                                }
                                }>
                                <Text> Capteur : </Text>
                            </Col>  
                            </Row> */}
                        <Row size={10}>
                        </Row>
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

 