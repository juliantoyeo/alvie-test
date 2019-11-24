import React from 'react';

import { SafeAreaView } from 'react-navigation';
import { Dimensions, Image, StyleSheet,AsyncStorage  } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Card, CardItem, Button, Row, Body, Icon, Text, H1, Grid, H2, H3, Col } from 'native-base';
import SelectPhyto from '../components/SelectPhyto';
import HeaderHygo from '../components/HeaderHygo';
import DashBoard from '../components/DashBoard';

class DashboardScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date().getDate(),
            month: new Date().getMonth()+1 
        }
       
    }
  }
    

    render() {

        if ((!this.props.produitPhytoClicked)||(!(storedDateSession===this.state.date)) ){
            return (
                <SafeAreaView style={{ flex: 1 }} forceInset={{top:'always'}}>
                <Container>
                    <HeaderHygo/>    
                    <SelectPhyto
                        userName = {this.props.userName}
                        date = {this.state.date}
                        month = {this.state.month}
                    /> 
                </Container> 
                </SafeAreaView>
            );
        } else {
             return (
                <SafeAreaView style={{ flex: 1 }} forceInset={{top:'always'}}>
                <Container style={styles.container}>
                    <HeaderHygo/>
                    <Content>
                        <DashBoard
                            userName = {this.props.userName}
                            date = {this.state.date}
                            month = {this.state.month}
                        />
                    </Content>     
                </Container> 
                </SafeAreaView>
                );
            }
         
         }
}

const styles = StyleSheet.create({
    progressBar: {
        flexDirection: 'row',
        height: 20,
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    },
    container: {
        backgroundColor: '#F6F6E9',
    }
   
});
const mapStateToProps = (state) => ({
    token: state.authen.token,
    userName: state.authen.userName,
    produitPhytoClicked : state.pulve.produitPhytoClicked,
    newSession: state.pulve.newSession,
    lastSession: state.pulve.lastSession
});
const mapDispatchToProps = (dispatch, props) => ({
})
  
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);