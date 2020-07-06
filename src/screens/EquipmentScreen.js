import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-navigation';
import { Dimensions, StyleSheet, View, Text, ScrollView, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Content, Left, Right, Body, Title, Header, Button, Icon, Picker } from 'native-base';

import COLORS from '../colors';
import i18n from 'i18n-js';

import HygoButton from '../components/HygoButton'
import HygoCard from '../components/HygoCard'
import HygoPastille from '../components/HygoPastille'

import HygoSlider from '../components/HygoSlider'

import { storeEquipmentInformation } from '../api/hygoApi'

import {Amplitude, AMPLITUDE_EVENTS} from '../amplitude'
const {equipmentScreen: ampEvent} = AMPLITUDE_EVENTS

const EquipmentScreen = ({ navigation }) => {
  let result = navigation.getParam('result')

  const [step, setStep] = useState(result ? 'SELECT' : 'INIT')

  const [buses, setBuses] = useState(result ? {
    validated: true,
    buses: result.buses
  } : {
    validated: false,
    buses: null,
  })

  const [speed, setSpeed] = useState(result ? {
    validated: true,
    speed: result.speed
  } : {
    speed: 0,
    validated: false
  })

  const [pressure, setPressure] = useState(result ? { 
    pressure: result.pressure,
    validated: true
  } : {
    pressure: 1,
    validated: false
  })

  const [soil, setSoil] = useState(result ? {
    validated: true,
    soil: result.soil
  } : {
    soil: null,
    validated: false
  })

  const [family, setFamily] = useState(result ? {
    validated: !!result.family,
    family: result.family
  } : {
    family: 0,
    validated: false
  })

  useEffect( () => {
    console.log("Amplitude : ", ampEvent.render)
    Amplitude.logEventWithProperties(ampEvent.render, {
      timestamp: Date.now()
    })
  }, [])

  const updateBuses = (val) => {
    setBuses(prev => {
      let ns = { 
        buses: val, 
      }
      ns.validated = Object.values(ns.buses).filter(p => p).length > 0
      return ns
    })
  }

  const submitEquipment = () => {
    let params = {
      buses: buses.buses,
      speed: speed.speed,
      pressure: pressure.pressure,
      soil: soil.soil,
      family: family.family,
    }

    navigation.replace('LoadingScreen', {
      next: 'main',
      params: params,
      action: storeEquipmentInformation
    })
  }

  const buildList = () => {
    let soils = [
      // "SOIL_TEST",
      "SABLE",
      "SABLE_TERREAU",
      "TERREAU",
      "TERREAU_ARGILE",
      "ARGILE"
    ]

    let l = soils.map(p => {
      return (
        <Picker.Item key={p} label={i18n.t(`soils.${p}`)} value={p} />
      )
    })

    if (Platform.OS === 'android') {
      l.unshift(<Picker.Item key={0} label={i18n.t('soils.none')} value={null} />)
    }

    return l
  }

  const buildFamilyList = () => {
    let soils = [
      "CLASSIC_STD",
      "CLASSIC_LOW",
      "CALIBRATE",
      "INJECTION",
    ]

    let l = soils.map(p => {
      return (
        <Picker.Item key={p} label={i18n.t(`equipment.buses_${p}`)} value={p} />
      )
    })

    if (Platform.OS === 'android') {
      l.unshift(<Picker.Item key={0} label={i18n.t('equipment.no_buse')} value={null} />)
    }

    return l
  }

  const notifyAmplitude = () => {
    console.log("Amplitude : ", ampEvent.click_validate)
    Amplitude.logEventWithProperties(ampEvent.click_validate, {
      timestamp: Date.now()
    })
  }
  
  return (
    <SafeAreaView style={styles.statusbar} forceInset={{top: 'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
        <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
          <Left style={{ flex: 1 }}>
            { result && (
              <Button transparent onPress={() => navigation.goBack()}>
                <Icon name='close' style={{ color: '#fff' }} />
              </Button>
            )}
          </Left>
          <Body style={styles.headerBody}>
            <Title style={styles.headerTitle}>{i18n.t('equipment.header')}</Title>
          </Body>
          <Right style={{ flex: 1 }}></Right>
        </Header>
        
        { step === 'INIT' && (
          <Content contentContainerStyle={styles.container}>
            <View style={{ flex: 2 }} />
            <Text textAlign="center" style={styles.title}>{i18n.t('equipment.title_notice')}</Text>
            <Text textAlign="center" style={styles.text}>{i18n.t('equipment.text_notice')}</Text>
            <View style={{ flex: 2 }} />

            <View style={[StyleSheet.absoluteFill, styles.buttonView]}>
              <HygoButton onPress={() => setStep('SELECT')} label={i18n.t('button.next')} icon={{
                type: 'AntDesign',
                name: 'arrowright',
                fontSize: 26
              }} />
            </View>
          </Content>
        )}

      { step === 'SELECT' && (
        <ScrollView>
          <Content contentContainerStyle={styles.containerSelect}>
            <HygoCard title={i18n.t('equipment.buses_family')} validated={family.validated} content={(
              <View style={{ display: 'flex', flexDirection: 'column', paddingLeft: 10 }}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  placeholder={i18n.t('equipment.no_buse')}
                  itemTextStyle={{
                    flex: 1,
                    color: '#aaa',
                    fontSize: 16,
                    fontFamily: 'nunito-regular',
                  }}
                  note={false}
                  placeholderStyle={{ color: "#194769" }}
                  headerBackButtonText='retour'
                  placeholderIconColor="59DFD6"
                  selectedValue={family.family}
                  onValueChange={(v) => setFamily(prev => {
                    return {
                      validated: !!v,
                      family: v,
                    }
                  })}>
                  { buildFamilyList() }
                </Picker>
              </View>
            )} />

            <HygoCard title={i18n.t('equipment.buses')} validated={buses.validated} content={(
              <View style={{ display: 'flex', flexDirection: 'column', paddingTop: 36, paddingBottom: 16 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <HygoPastille onPress={() => updateBuses('orange')} style={{ flex: 1}} color='#fc9a02' colorText={i18n.t('equipment.orange')} checked={buses.buses === 'orange'} />
                  <HygoPastille onPress={() => updateBuses('green')} style={{ flex: 1}} color='#03cb01' colorText={i18n.t('equipment.green')} checked={buses.buses === 'green'} />
                  <HygoPastille onPress={() => updateBuses('yellow')} style={{ flex: 1}} color='#feff02' colorText={i18n.t('equipment.yellow')} checked={buses.buses === 'yellow'} dark />
                  <HygoPastille onPress={() => updateBuses('lilas')} style={{ flex: 1}} color='#9955bb' colorText={i18n.t('equipment.lilas')} checked={buses.buses === 'lilas'} />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <HygoPastille onPress={() => updateBuses('blue')} style={{ flex: 1}} color='#33339d' colorText={i18n.t('equipment.blue')} checked={buses.buses === 'blue'} />
                  <HygoPastille onPress={() => updateBuses('red')} style={{ flex: 1}} color='#fd0000' colorText={i18n.t('equipment.red')} checked={buses.buses === 'red'} />
                  <HygoPastille onPress={() => updateBuses('brown')} style={{ flex: 1}} color='#9a6700' colorText={i18n.t('equipment.brown')} checked={buses.buses === 'brown'} />
                  <HygoPastille onPress={() => updateBuses('grey')} style={{ flex: 1}} color='#969696' colorText={i18n.t('equipment.grey')} checked={buses.buses === 'grey'} />
                </View>
              </View>
            )} />

            <HygoCard title={i18n.t('equipment.speed')} validated={speed.validated} content={(
              <View style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
                <HygoSlider
                  min={0}
                  max={35}
                  sliderLength={Dimensions.get('window').width - 36 - 20}
                  value={speed.speed}
                  updateValue={(v) => setSpeed({
                    speed: v,
                    validated: v > 0
                  })}
                />
              </View>
            )} />

            <HygoCard title={i18n.t('equipment.pressure')} validated={pressure.validated} content={(
              <View style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
                <HygoSlider
                  min={1}
                  max={6}
                  increment={0.5}
                  sliderLength={Dimensions.get('window').width - 36 - 20}
                  value={pressure.pressure}
                  updateValue={(v) => setPressure({
                    pressure: v,
                    validated: true
                  })}
                />
              </View>
            )} />

            <HygoCard title={i18n.t('equipment.type_soil')} validated={soil.validated} content={(
              <View style={{ display: 'flex', flexDirection: 'column', paddingLeft: 10 }}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  placeholder={i18n.t('soils.none')}
                  itemTextStyle={{
                    flex: 1,
                    color: '#aaa',
                    fontSize: 16,
                    fontFamily: 'nunito-regular',
                  }}
                  note={false}
                  placeholderStyle={{ color: "#194769" }}
                  headerBackButtonText ='retour'
                  placeholderIconColor="59DFD6"
                  selectedValue={soil.soil}
                  onValueChange={(v) => setSoil(prev => {
                    return {
                      validated: !!v,
                      soil: v,
                    }
                  })}>
                  { buildList() }
                </Picker>
              </View>
            )} />


          </Content>
          { speed.validated && pressure.validated && buses.validated && family.validated && (
            <View>
              <View style={{ height: 80 }} />
              <View style={[StyleSheet.absoluteFill, styles.buttonView]}>
                <HygoButton action = {notifyAmplitude} onPress={() => submitEquipment()} label={i18n.t('button.validate')} icon={{
                  type: 'AntDesign',
                  name: 'arrowright',
                  fontSize: 26
                }} />
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.CYAN
  },
  headerBody: {
    flex: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontFamily: 'nunito-regular',
    fontSize: 20
  },  
  statusbar: { backgroundColor: COLORS.BEIGE, flex: 1 },
  container: { justifyContent: 'center', flex: 1, display: 'flex', paddingLeft: 38, paddingRight: 38, alignItems: 'center' },
  containerSelect: { justifyContent: 'flex-start', flex: 1, display: 'flex', paddingLeft: 0, paddingRight: 15, backgroundColor: COLORS.BEIGE },
  title: {
    color: COLORS.DARK_BLUE,
    textAlign: 'center',
    fontSize: 24,
    flex: 1,
    fontFamily: 'nunito-regular'
  },
  loading: {
    color: COLORS.DARK_BLUE,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'nunito-regular'
  },
  text: {
    color: COLORS.DARK_GREEN,
    textAlign: 'center',
    fontSize: 18,
    flex: 1,
    fontFamily: 'nunito-regular'
  },
  buttonView: { 
    display: 'flex', 
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'flex-end' 
  },
  cardTitle: {
    textTransform: 'uppercase',
    color: COLORS.CYAN,
    fontFamily: 'nunito-bold',
    fontSize: 14,
    flex: 1
  }
});

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch, props) => ({})
  
export default connect(mapStateToProps, mapDispatchToProps)(EquipmentScreen);
