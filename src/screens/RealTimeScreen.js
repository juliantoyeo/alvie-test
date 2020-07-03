import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text } from 'native-base';
import { getRealtimeData } from '../api/hygoApi';

import LogoLoading from '../components/LogoLoading'

import i18n from 'i18n-js'

import COLORS from '../colors'

import HygoChart from '../components/realtime/HygoChart';
import HygoGauge from '../components/realtime/HygoGauge';
import ConditionHeader from '../components/realtime/ConditionHeader'

import { connect } from 'react-redux'

import moment from 'moment-timezone'

import {Amplitude, AMPLITUDE_EVENTS} from '../amplitude'
const {realTimeScreen: ampEvent} = AMPLITUDE_EVENTS

const RealTimeScreen = ({ navigation, phytoProductList, phytoProductSelected }) => {
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [history, setHistory] = useState([])
  const [last, setLast] = useState({})
  const [ui, setUi] = useState({})
  const [currentMeteo, setCurrentMeteo] = useState({})
  const [currentCondition, setCurrentCondition] = useState({})

  const [color, setColor] = useState(COLORS.GREY)
  const [secondaryColor, setSecondaryColor] = useState(COLORS.GREY)

  useEffect(() => {
    loadRealtimeData()
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

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('willFocus', () => {
      setIsRefreshing(true)
      loadRealtimeData()
    });

    return () => {
      unsubscribeFocus.remove()
    };
  }, [navigation, loadRealtimeData, phytoProductSelected])
  
  const loadRealtimeData = async () => {
    let { history, last, ui, parcelleMeteo, parcelleMeteoProduct } = await getRealtimeData(phytoProductSelected)

    setHistory(history || [])
    setLast(history.length > 0 ? history[history.length-1] : {})
    setUi(ui)
    setCurrentMeteo(parcelleMeteo)
    setCurrentCondition(parcelleMeteoProduct)

    if (phytoProductSelected.length === 0 || !parcelleMeteoProduct.condition) {
      updateColors('CYAN')
    } else {
      updateColors(parcelleMeteoProduct.condition)
    }

    setLoading(false)
    setIsRefreshing(false)
  }

  const getLastHour = (dt, separator) => {
    let d = moment.utc(dt || parseInt(last.timestamp)).tz('Europe/Paris').format('HH:mm')
    return `${d}`
  }

  const onRefresh = async () => {
    setIsRefreshing(true)
    await loadRealtimeData()
    setIsRefreshing(false)
  }

  const updateColors = (c) => {
    setSecondaryColor(COLORS[`${c}_GRADIENT_TOP`])
    setColor(COLORS[`${c}_GRADIENT_BOT`])
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
            <Title style={styles.headerTitle}>{i18n.t('realtime.header')}</Title>
          </Body>
          <Right style={{ flex: 1 }}></Right>
        </Header>

        { loading && (
          <View style={[StyleSheet.absoluteFill, {display: 'flex', alignItems: 'center', justifyContent: 'center'}]}>
            <LogoLoading color={COLORS.CYAN} duration={1000} />
          </View>
        )}

        { !loading && (
          <Content contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.BEIGE, padding: 0, disableKBDismissScroll: true }} 
              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
          
            <View>
              <ConditionHeader isRefreshing={isRefreshing} history={history} currentMeteo={currentMeteo} currentCondition={currentCondition} />
              <View style={styles.lastHour}>
                <Text style={styles.lastHourText}>{history.length === 0 ? i18n.t('realtime.no_data_3_hours') : i18n.t('realtime.last_hour', { value: getLastHour() })}</Text>
              </View>

              <TouchableWithoutFeedback onPress={() => navigation.navigate("HygoProductPicker", {backScreen: 'RealTime'})}>
                <View style={styles.picker}>
                  { phytoProductSelected.length === 0 && (
                    <Text style={styles.pickerText}>{i18n.t('pulverisation.product_type')}</Text>
                  )}
                  { phytoProductSelected.length > 0 && (
                    <Text style={styles.pickerText}>{ phytoProductList.filter(pp => phytoProductSelected.indexOf(pp.id) > -1).map(pp => i18n.t(`products.${pp.name}`)).join(', ') }</Text>
                  )}
                  <Icon style={styles.pickerIcon} type="Feather" name="chevron-down" />
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.gaugeContainer}>
                <HygoGauge value={last && typeof last.temp !== 'undefined' ? Math.round(last.temp, 1) : null} min={-10} max={50} color={color} img={require('../../assets/thermo.png')} unit="°C" />
                <HygoGauge value={last && typeof last.humi !== 'undefined' ? Math.round(last.humi) : null} min={0} max={100} color={color} img={require('../../assets/ICN-Hygro.png')} unit="%" />
                <HygoGauge value={currentMeteo && typeof currentMeteo.windspeed !== 'undefined' ? Math.round(currentMeteo.windspeed) : null} min={0} max={50} color={color} img={require('../../assets/ICN-Wind.png')} unit=" km/h" />
              </View>

              { history.length > 1 && (
                <HygoChart label={i18n.t('realtime.hygro')} data={history.map(h => {
                  return { x: new Date(h.timestamp), y: h.humi }
                })} mainColor={color} secondaryColor={secondaryColor} />
              )}

              { history.length > 1 && (
                <HygoChart label={i18n.t('realtime.temp')} data={history.map(h => {
                  return { x: new Date(h.timestamp), y: h.temp }
                })} mainColor={color} secondaryColor={secondaryColor} />
              )}
              {last && typeof last.dewpoint !== 'undefined' &&
                <View style={styles.dewpoint}>
                  <Text style={styles.dewpointText}>{i18n.t('realtime.dewpoint') + ' : ' + Math.round(last.dewpoint, 1).toString() + ' °C'}</Text>
                </View>
              }
              <View style={{ paddingHorizontal: 32, marginTop: 40 }}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Pulverisation')}>
                  <Text style={styles.buttonText}>{history.length > 0 ? i18n.t('realtime.next_cuve') : i18n.t('realtime.goto_cuve')}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 60 }} />
            </View>
          </Content>
        )}
      </Container>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  pulveContainer: {
    backgroundColor: COLORS.CYAN,
    paddingRight: 15,
    paddingTop: 30,
    paddingBottom: 40,
  },
  picker: {
    shadowColor: '#000',
    shadowOpacity: .2,
    shadowOffset: {
      width: 0,
      height: 3
    },
    elevation: 3,
    backgroundColor: '#fff',
    paddingLeft: 20,
    borderTopRightRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 20,
    paddingVertical: 10,
  },
  pickerText: {
    flex: 1,
    color: COLORS.DARK_BLUE,
    fontSize: 16,
    fontFamily: 'nunito-bold',
  },
  pickerIcon: {
    marginLeft: 5,
    fontSize: 20,
    color: COLORS.DARK_BLUE
  },
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
  text: {
    color: COLORS.DARK_GREEN,
    textAlign: 'center',
    fontSize: 18,
    flex: 1,
    fontFamily: 'nunito-regular'
  },
  gaugeContainer: {
    padding: 25,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 40,
    justifyContent: 'space-around',
  },
  lastHour: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  lastHourText: {
    fontFamily: 'nunito-heavy',
    fontSize: 12,
    color: '#aaaaaa',
  },
  button: {
    borderRadius: 40,
    paddingVertical: 20,
    backgroundColor: COLORS.DARK_BLUE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'nunito-heavy',
    textTransform: 'uppercase'
  },
  dewpoint: {
    paddingLeft: 20,
    paddingTop: 10,
  },
  dewpointText: {
    flex: 1,
    color: COLORS.DARK_BLUE,
    fontSize: 16,
    fontFamily: 'nunito-bold',
  },
})

const mapStateToProps = (state) => ({
  phytoProductList: state.pulve.phytoProductList,
  phytoProductSelected: state.pulve.phytoProductSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(RealTimeScreen);