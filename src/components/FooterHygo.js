import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body, Icon, Text, H1 } from 'native-base';


export default class FooterHygo extends React.Component {
    render() {
        return (
                <Footer>
                    <FooterTab>
                        <Button vertical>
                            <Icon name="apps" />
                            <Text>Dashboard</Text>
                        </Button>
                        <Button vertical>
                            <Icon name="camera" />
                            <Text>Compte</Text>
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