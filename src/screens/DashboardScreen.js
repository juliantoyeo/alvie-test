import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Card, CardItem, Button, Row, Body, Icon, Text, H1, Grid, H2, H3, Col } from 'native-base';
import { getLastValue } from '../api/hygoApi';
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

    render() {
        
        console.log(this.state.date);
        
        
        if (!this.props.produitPhytoClicked){
            return (
                <Container style={styles.container}>
                    <HeaderHygo/>    
                    <SelectPhyto
                        userName = {this.props.userName}
                        date = {this.state.date}
                        month = {this.state.month}
                    /> 
                </Container> 
            );
        } else {
             return (
                <Container>
                    <HeaderHygo/>
                    <Content>
                        <DashBoard
                            userName = {this.props.userName}
                            date = {this.state.date}
                            month = {this.state.month}
                        />
                    </Content>     
                </Container> 
                );
            }
            
        
    }
}
const width = Dimensions.get('window').width
const height = 220

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
    produitPhytoClicked : state.pulve.produitPhytoClicked
});
const mapDispatchToProps = (dispatch, props) => ({
})
  
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);