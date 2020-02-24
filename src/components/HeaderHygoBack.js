import React, { Component } from 'react';
import { StyleSheet} from 'react-native';
import {  Header, Button, Left, Icon, Text} from 'native-base';
import * as Font from 'expo-font';
import { withNavigation } from 'react-navigation';

class HeaderHygoBack extends React.Component {
    componentDidMount() {
        Font.loadAsync({
          'Roboto_medium': require('../../assets/font/Roboto-Medium.ttf'),
        });
      }
    render() {
        return (
                <Header style={styles.header}>
                    <Left >
                        <Button transparent 
                            onPress={() => this.props.navigation.navigate('Interventions')}
                        >
                            <Icon name='arrow-back' />
                            <Text>Retour</Text>
                        </Button>
                    </Left>
                </Header>
            )
    }
};       

const styles = StyleSheet.create({    
    header: {
        backgroundColor: '#F6F6E9',
        
    },     
});
export default withNavigation(HeaderHygoBack);