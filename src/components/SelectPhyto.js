import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body, Icon, Text, H1, H2 } from 'native-base';
import { getLastValue } from '../api/hygoApi';
import ProductList from './ProductList';

 
export default class SelectPhyto extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          date: props.date
        };
      }
    render() {
        return (
            <Content contentContainerStyle = {{flex: 1}}>
                        <View style = {
                            {
                                flex: 1,
                                flexDirection: 'column',
                                //alignItems:'center', 
                                alignContent:'center',
                                justifyContent : 'space-around',
                                
                            }
                        }>
                            <H1 style={{color : '#194769'}}>
                                Bonjour {this.props.userName} ! 
                            </H1>
                            <Icon type ="FontAwesome5" name="tractor" style={{color : '#194769', fontSize: 65}}/>
                            <H2 style={{color : '#194769'}}>
                                Nous sommes le {this.props.date}/{this.props.month}!
                            </H2>
                            <H2 style={{color : '#194769'}}>
                                Quel produit utilisez-vous aujourd'hui?
                            </H2>
                            <View style={{backgroundColor : '#D9EEF6', borderColor: 'B7DAE3',color:'#194769'}}>
                                <ProductList/>
                            </View>
                            
                        </View>
            </Content>
        );
    }
}   

    
    


