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
            <Container>
                <Header style={styles.header}>
                    <Right>
                        <Image style={styles.image} source={require('../../assets/HYGO_by_Alvie_logo.png')} />
                    </Right>
                </Header>
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
                <Footer>
                    <FooterTab>
                        <Button full>
                        <Text>Footer</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}   
    const styles = StyleSheet.create({
       
        header: {
            backgroundColor: '#FCFCFC',
        }
       
    });
    
    


