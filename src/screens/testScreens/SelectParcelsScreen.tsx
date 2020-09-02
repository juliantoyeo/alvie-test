import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text } from 'native-base';
import { getInterventions } from '../../api/hygoApi';
import i18n from 'i18n-js'
import COLORS from '../../colors'
import {Amplitude, AMPLITUDE_EVENTS} from '../../amplitude'
const {selectParcelsScreen: ampEvent} = AMPLITUDE_EVENTS

const SelectParcelsScreen = ({ navigation }) => {


    return (
        <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
            <StatusBar translucent backgroundColor="transparent" />
            <Content contentContainerStyle={[{backgroundColor: COLORS.DARK_BLUE, display:"flex",flexDirection:"column" ,justifyContent:'flex-end'}, StyleSheet.absoluteFill]}>
                <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
                    <Left style={{ flex: 1 }}></Left>
                    <Body style={styles.headerBody}>
                        <Title style={styles.headerTitle}>Test Select Parcels</Title>
                    </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>
            </Content>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    content: {
      flex: 1,
      backgroundColor: COLORS.BEIGE
    },
    statusbar: { 
      flex: 1, 
      display: 'flex',
      backgroundColor: Platform.OS === 'ios' ? 'black' : COLORS.CYAN,
    },
    container: { 
      flex: 1, 
      display: 'flex', 
    },
    header: {
      backgroundColor: COLORS.CYAN
    },
    headerBody: {
      flex: 3,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      color: '#fff',
      fontFamily: 'nunito-regular',
      fontSize: 24
    },  
    scrollContainer: { 
      padding: 10,
      display: 'flex',
      flex: 1,
      paddingLeft: 0,
      paddingRight: 15,
      backgroundColor: COLORS.BEIGE,
      flexGrow: 1,
    },
    text: {
      color: COLORS.DARK_GREEN,
      textAlign: 'center',
      fontSize: 18,
      flex: 1,
      fontFamily: 'nunito-regular'
    },
    message: {
      justifyContent: 'center', 
      flex: 1, 
      display: 'flex', 
      paddingLeft: 38, 
      paddingRight: 38, 
      alignItems: 'center'
    }
  });
  
  const mapStateToProps = (state) => ({
    
  });
  
  const mapDispatchToProps = (dispatch, props) => ({
    
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SelectParcelsScreen);