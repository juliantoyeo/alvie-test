import React, { Component } from 'react';
import { StyleSheet} from 'react-native';
import {  Header, Button, Left, Icon, Text} from 'native-base';
import * as Font from 'expo-font';
import { withNavigation } from 'react-navigation';

class HeaderHygoBack extends React.Component {
    render() {
        return (
                <Header style={styles.header}>
                    
                        <Button transparent 
                            onPress={() => this.props.navigation.navigate('Interventions')}
                        >
                            <Icon name='arrow-back' style={styles.icon} />
                            <Text style={styles.icon} >Retour</Text>
                        </Button>
                    
                </Header>
            )
    }
};       

const styles = StyleSheet.create({    
    header: {
        backgroundColor: '#F6F6E9',
        alignItems: 'flex-start' ,
        justifyContent: 'flex-start',
        flexDirection: 'row',
         
    }, 
    icon:{
        color : '#000000',
    }

});
export default withNavigation(HeaderHygoBack);