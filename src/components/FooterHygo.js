import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body, Icon, Text, H1 } from 'native-base';


export default class SelectPhyto extends React.Component {
    render() {
        return (
                <Footer>
                    <FooterTab>
                        <Button full>
                        <Text>Footer</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            )
    }
};       

const styles = StyleSheet.create({    
    header: {
        backgroundColor: '#FCFCFC',
    }     
});