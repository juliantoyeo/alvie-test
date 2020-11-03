import React, { useState, useEffect } from 'react'
import { StatusBar, StyleSheet, SafeAreaView, View, ImageBackground } from 'react-native'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Tabs, Tab } from 'native-base';

import i18n from 'i18n-js'

import MeteoBriefScreen from './MeteoBriefScreen'
import MeteoRadar from './MeteoRadar'
import MeteoDetailed from './MeteoDetailed'

import * as Localization from 'expo-localization';

import {Amplitude, AMPLITUDE_EVENTS} from '../amplitude'
import { now } from 'lodash';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const MeteoScreen = ({ navigation }) => {
  const [currentTab, setCurrentTab] = useState(0)
  const tabs = ["meteoBriefScreen", "meteoDetailedScreen", "meteoRadarScreen"]
  const switchTab = (i) => {
    setCurrentTab(i);
  }
  useEffect( () => {
    const unsubscribe = navigation.addListener('didFocus', () => {
      setCurrentTab(0)
    })
    return () => unsubscribe.remove()
  }, [])

  useEffect( () => {
    // console.log("Amplitude : ", AMPLITUDE_EVENTS[tabs[currentTab]].render)
    Amplitude.logEventWithProperties(AMPLITUDE_EVENTS[tabs[currentTab]].render, {
      timestamp: Date.now()
    })
  }, [currentTab])

  return (
    <SafeAreaView style={[styles.statusbar, { backgroundColor: 'black' }]} forceInset={{top:'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground source={require('../../assets/meteo_back.png')} imageStyle={{  resizeMode: 'cover', flex: 1 }} style={styles.container}>
        <Container style={styles.content}>
          <Header style={styles.header} androidStatusBarColor="transparent" hasTabs transparent iosBarStyle="light-content">
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => navigation.toggleDrawer() }>
                <Icon name='menu' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={styles.headerBody}>
              <Title style={styles.headerTitle}>{i18n.t('meteo.header')}</Title>
            </Body>
            <Right style={{ flex: 1 }}></Right>
          </Header>
          <Tabs locked={true} initialPage={0} page={currentTab} tabContainerStyle={styles.tabBar} tabBarUnderlineStyle={{ backgroundColor: '#fff' }} onChangeTab={({i}) => switchTab(i)  }>
            <Tab style={[styles.tabBar]} textStyle={styles.textStyle} activeTextStyle={styles.textStyle} activeTabStyle={[styles.tabStyle]} tabStyle={styles.tabStyle} heading={i18n.t('meteo.brief')}>
              <MeteoBriefScreen style={styles.tabBar} navigation={navigation} />
            </Tab>
            {/*
                <Tab style={[styles.tabBar]} textStyle={styles.textStyle} activeTextStyle={styles.textStyle} activeTabStyle={[styles.tabStyle]} tabStyle={styles.tabStyle} heading={i18n.t('meteo.detailed')}>
              <MeteoDetailed navigation={navigation} style={styles.tabBar} />
            </Tab>
            */}
            { Localization.locale.indexOf('cs') === -1 && (
              <Tab style={[styles.tabBar]} textStyle={styles.textStyle} activeTextStyle={styles.textStyle} activeTabStyle={[styles.tabStyle]} tabStyle={styles.tabStyle} heading={i18n.t('meteo.radar')}>
                <MeteoRadar style={styles.tabBar} navigation={navigation} active={currentTab === 2} />
              </Tab>
            )}
          </Tabs>
        </Container>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  statusbar: { 
    flex: 1, 
    display: 'flex',
  },
  container: { 
    flex: 1, 
    display: 'flex', 
  },
  header: {
    backgroundColor: 'transparent',
  },
  headerBody: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontFamily: 'nunito-regular',
    fontSize: 24
  },  
  content: {
    flex: 1,
    backgroundColor: Colors.BEIGE
  },
  tabBar: { 
    backgroundColor: 'transparent', 
    shadowOffset: { width: 0, height: 0}, 
    elevation: 0,
    borderBottomWidth: 0
  },
  tabStyle: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0
  },
  textStyle: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 14,
    fontFamily: 'nunito-bold',
  }
})

export default MeteoScreen