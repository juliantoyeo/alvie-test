import React from 'react';
import { AsyncStorage } from 'react-native';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { deleteToken } from '../store/actions/authActions'
import HeaderHygo from '../components/HeaderHygo';
import ProductList from '../components/ProductList';
import UserAvatar from 'react-native-user-avatar';
import { Container, Header, Title, Content, Footer, FooterTab, Button, H2, Form, Icon, Text, H1,H3, Grid, Row, Col } from 'native-base';
import { SafeAreaView } from 'react-navigation';

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
                                <UserAvatar size="70" name={this.props.userName|| "xx xx"} />
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
                                    {this.props.userName}
                                </H1>
                            </Col>
                        </Row>
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
                            flexDirection:"column",
                            }}>
                            <H2> Changer de famille de produit à pulvériser</H2>
                            <Form style={{backgroundColor : '#D9EEF6', borderColor: '#B7DAE3',color:'#194769'}}>
                                <ProductList />
                            </Form>
                        </Row>
                        <Row size={15} style ={
                            {
                            padding: 10, 
                            
                            }}>
                            <H2> Un problème, une idée, n'hésité pas à nous contacter</H2>
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
                                <H3> 06 29 05 60 12</H3>
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
                                <H3> editab@alvie.fr</H3>
                            </Col>  
                        </Row>
                        <Row size={10}>
                        </Row>
                    </Grid>
                </Content> 
      
            </Container> 
            </SafeAreaView>
            
        )
    }
}


const mapStateToProps = (state) => ({
      produitPhytoClicked: state.pulve.produitPhytoClicked,
      token: state.authen.token,
      userName : state.authen.userName,
    }
);

  const mapDispatchToProps = (dispatch, props) => ({
    deleteToken: () => dispatch(deleteToken())
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);

 