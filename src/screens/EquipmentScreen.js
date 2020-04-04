import React, { useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { Dimensions, StyleSheet, View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Content } from 'native-base';

import COLORS from '../colors';
import i18n from 'i18n-js';

import HygoButton from '../components/HygoButton'
import HygoCard from '../components/HygoCard'
import HygoPastille from '../components/HygoPastille'

import HygoSlider from '../components/HygoSlider'

import { storeEquipmentInformation } from '../api/hygoApi'

const EquipmentScreen = ({ navigation }) => {
  const [step, setStep] = useState('INIT')

  const [buses, setBuses] = useState({
    validated: false,
    buses: {},
  })

  const [speed, setSpeed] = useState({
    speed: 0,
    validated: false
  })

  const [pressure, setPressure] = useState({
    pressure: -50,
    validated: false
  })

  const updateBuses = (val) => {
    setBuses(prev => {
      let ns = { 
        buses: {
          ...prev.buses,
          [val]: !prev.buses[val]
        }, 
      }
      ns.validated = Object.values(ns.buses).filter(p => p).length > 0
      return ns
    })
  }

  const submitEquipment = () => {
    let params = {
      buses: buses.buses,
      speed: speed.speed,
      pressure: pressure.pressure
    }

    navigation.replace('LoadingScreen', {
      next: 'mainFlow',
      params: params,
      action: storeEquipmentInformation
    })
  }

  return (
    <SafeAreaView style={styles.statusbar}>
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
        <ScrollView style={{ flex: 1, paddingTop: 10 }}>
          <Content contentContainerStyle={styles.containerSelect}>
            <HygoCard title={i18n.t('equipment.buses')} validated={buses.validated} content={(
              <View style={{ display: 'flex', flexDirection: 'column', paddingTop: 36, paddingBottom: 16 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <HygoPastille onPress={() => updateBuses('orange')} style={{ flex: 1}} color='#fc9a02' colorText={i18n.t('equipment.orange')} checked={buses.buses.orange || false} />
                  <HygoPastille onPress={() => updateBuses('green')} style={{ flex: 1}} color='#03cb01' colorText={i18n.t('equipment.green')} checked={buses.buses.green || false} />
                  <HygoPastille onPress={() => updateBuses('yellow')} style={{ flex: 1}} color='#feff02' colorText={i18n.t('equipment.yellow')} checked={buses.buses.yellow || false} dark />
                  <HygoPastille onPress={() => updateBuses('blue')} style={{ flex: 1}} color='#33339d' colorText={i18n.t('equipment.blue')} checked={buses.buses.blue || false} />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <HygoPastille onPress={() => updateBuses('red')} style={{ flex: 1}} color='#fd0000' colorText={i18n.t('equipment.red')} checked={buses.buses.red || false} />
                  <HygoPastille onPress={() => updateBuses('brown')} style={{ flex: 1}} color='#9a6700' colorText={i18n.t('equipment.brown')} checked={buses.buses.brown || false} />
                  <HygoPastille onPress={() => updateBuses('grey')} style={{ flex: 1}} color='#969696' colorText={i18n.t('equipment.grey')} checked={buses.buses.grey || false} />
                  <HygoPastille onPress={() => updateBuses('white')} style={{ flex: 1}} color='#ffffff' colorText={i18n.t('equipment.white')} checked={buses.buses.white || false} dark />
                </View>
              </View>
            )} />

            <HygoCard title={i18n.t('equipment.speed')} validated={speed.validated} content={(
              <View style={{ display: 'flex', flexDirection: 'column', paddingLeft: 10 }}>
                <HygoSlider
                  min={0}
                  max={100}
                  sliderLength={Dimensions.get('window').width - 36 - 15 - 20}
                  value={speed.speed}
                  updateValue={(v) => setSpeed({
                    speed: v,
                    validated: v > 0
                  })}
                  steps
                />
              </View>
            )} />

            <HygoCard title={i18n.t('equipment.pressure')} validated={pressure.validated} content={(
              <View style={{ display: 'flex', flexDirection: 'column', paddingLeft: 10 }}>
                <HygoSlider
                  min={-50}
                  max={100}
                  sliderLength={Dimensions.get('window').width - 36 - 15 - 20}
                  value={pressure.pressure}
                  updateValue={(v) => setPressure({
                    pressure: v,
                    validated: v > -50
                  })}
                />
              </View>
            )} />


          </Content>
          { speed.validated && pressure.validated && buses.validated && (
            <View>
              <View style={{ height: 80 }} />
              <View style={[StyleSheet.absoluteFill, styles.buttonView]}>
                <HygoButton onPress={() => submitEquipment()} label={i18n.t('button.validate')} icon={{
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
  statusbar: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: COLORS.BEIGE },
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
