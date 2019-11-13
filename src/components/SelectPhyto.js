import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body, Icon, Text, H1 } from 'native-base';
import { getLastValue } from '../api/hygoApi';
import ProductList from '../components/ProductList';


export default class SelectPhyto extends React.Component {
    render() {
        return (
                    <Content contentContainerStyle={{ flexGrow: 1}} >
                        <View style = {
                            {
                                flex: 1,
                                flexDirection: 'column',
                                alignItems:'center', 
                                alignContent:'center',
                                justifyContent : 'space-around',
                                
                            }
                        }>
                            <H1 >
                                Bonjour {this.props.userName} ! 
                            </H1>
                            <Text>
                                Nous sommes le mercredi {this.props.date}
                            </Text>
                            <Text>
                                Quel Produit utilisez-vous aujourd'hui?
                            </Text>
                            <ProductList/>
                        </View>
                    </Content>
               
        );
    }
}   

    
    


