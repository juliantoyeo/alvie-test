import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text } from 'native-base';
import HygoInterventionCard from '../components/HygoInterventionCard';
import { getInterventions } from '../api/hygoApi';
import { updateInterv } from '../store/actions/intervActions';

import LogoLoading from '../components/LogoLoading'

import i18n from 'i18n-js'

import COLORS from '../colors'

import {Amplitude, AMPLITUDE_EVENTS} from '../amplitude'
const {interventionScreen: ampEvent} = AMPLITUDE_EVENTS

const InterventionScreen = ({ navigation, interventionValues, updateInterv }) => {
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadInterventions()
    const unsubscribe = navigation.addListener('didFocus', () => {
      loadInterventions()
    });
    return (() => unsubscribe())
  }, [])

  useEffect( () => {
    console.log("Amplitude : ", ampEvent.render)
    Amplitude.logEventWithProperties(ampEvent.render, {
      timestamp: Date.now()
    })
    const unsubscribe = navigation.addListener('didFocus', () => {
      console.log("Amplitude : ", ampEvent.render)
      Amplitude.logEventWithProperties(ampEvent.render, {
        timestamp: Date.now()
      })
    })
    return () => unsubscribe()
  }, [])

  const loadInterventions = async () => {
    let {interventionValues} = await getInterventions()
    if (interventionValues) {
      updateInterv(interventionValues);
    }

    setLoading(false)
  }

  const onRefresh = async () => {
    setIsRefreshing(true)
    await loadInterventions()
    setIsRefreshing(false)
  }

  return (
    <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <Container style={styles.content}>
        <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => navigation.toggleDrawer() }>
              <Icon name='menu' style={{ color: '#fff' }} />
            </Button>
          </Left>
          <Body style={styles.headerBody}>
            <Title style={styles.headerTitle}>{i18n.t('intervention.header')}</Title>
          </Body>
          <Right style={{ flex: 1 }}></Right>
        </Header>

        { loading && (
          <View style={[StyleSheet.absoluteFill, {display: 'flex', alignItems: 'center', justifyContent: 'center'}]}>
            <LogoLoading color={COLORS.CYAN} duration={1000} />
          </View>
        )}

        { !loading && (
            <Content contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.BEIGE, padding: 10, paddingLeft: 0, paddingRight: 15, disableKBDismissScroll: true }} 
              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
              { interventionValues.length >= 1 && (
                <View>
                  { interventionValues.map((intervention) => {
                    return (
                      <HygoInterventionCard 
                        key={intervention.id}
                        navigation={navigation}
                        intervention={intervention}
                        onPress={(interv) => navigation.navigate('InterventionMapScreen', { intervention: interv })}
                      />
                    );
                  })}

                  <View style={{ height: 50 }}></View>
                </View>
              )}
          
              { interventionValues.length < 1 && (
                <>
                  <View style={{ flex: 2 }} />
                  <Text textAlign="center" style={styles.text}>{i18n.t('intervention.no_data')}</Text>
                  <View style={{ flex: 2 }} />
                </>
              )}
            </Content> 
        )}
      </Container>
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
  interventionValues: state.interv.interventions
});

const mapDispatchToProps = (dispatch, props) => ({
  updateInterv: (interventionValues)=>dispatch(updateInterv(interventionValues)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterventionScreen);



