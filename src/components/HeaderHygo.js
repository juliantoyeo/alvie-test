import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body, Icon, Text, H1 } from 'native-base';
import * as Font from 'expo-font';

export default class HeaderHygo extends React.Component {
    componentDidMount() {
        Font.loadAsync({
          'Roboto_medium': require('../../assets/font/Roboto-Medium.ttf'),
        });
      }
    render() {
        return (
                <Header style={styles.header}>
                <Right >
                    <Image style={styles.image} source={require('../../assets/HYGO_by_Alvie_logo.png')} />
                </Right>
                </Header>
            )
    }
};       

const styles = StyleSheet.create({    
    header: {
        backgroundColor: '#F6F6E9',
    },     
});