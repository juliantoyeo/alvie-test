import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-navigation';
import { ScrollView, StyleSheet, View, StatusBar } from 'react-native';
import { Button, Icon, Text, Left, Right, Body, Header, Title } from 'native-base';

import COLORS from '../colors'
import i18n from 'i18n-js'

import Map from '../components/meteo-detailed/Map'
import MapLegend from '../components/meteo-detailed/MapLegend'
import MeteoMetrics from '../components/meteo-detailed/MeteoMetrics'
import MeteoMapHeader from '../components/meteo-detailed/MeteoMapHeader'
import MeteoMapHeaderSelected from '../components/meteo-detailed/MeteoMapHeaderSelected'
import MeteoWhiteStatus from '../components/meteo-detailed/MeteoWhiteStatus';
import MeteoSlider from '../components/meteo-detailed/MeteoSlider';

import { PADDED } from '../constants'

const MeteoDetailedDetails = ({ navigation }) => {
  let { days, products, data, region, parcelles } = navigation.getParam('result')

  const [selected, setSelected] = useState(null)

  const [currentHour, setCurrentHour] = useState(10)

  const getCurrentDay = useCallback(() => {
    return days[0]
  }, [days])

  const getCurrentDayData = useCallback(() => {
    return data[getCurrentDay()].hours1[`${products[0].id}`].data
  }, [days[0], products[0]])

  const getCurrentData = useCallback(() => {
    return getCurrentDayData()[PADDED[parseInt(currentHour)]]
  }, [days[0], products[0], currentHour])

  const getCurrentHourMetrics = useCallback(() => {
    return data[PADDED[parseInt(currentHour)]].data
  }, [currentHour])

  const getBackground = useCallback(() => {
    return COLORS[`${getCurrentData().condition}`]
  }, [currentHour])

  return (
    <SafeAreaView style={[styles.statusbar, { backgroundColor: getBackground() }]} forceInset={{top:'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <Header hasTabs style={[styles.header, { backgroundColor: getBackground() }]} androidStatusBarColor={getBackground()} iosBarStyle="light-content">
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name='close' style={{ color: '#fff' }} />
            </Button>
          </Left>
          <Body style={styles.headerBody}>
            <Title style={styles.headerTitle}>{i18n.t('meteo_overlay.header', { from: currentHour, to: currentHour+1 })}</Title>
          </Body>
          <Right style={{ flex: 1 }}></Right>
        </Header>

        <View style={styles.details}>
          <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.productName}>{ products[0].name }</Text>
            <Text style={styles.currentCondition}>{i18n.t(`intervention_map.${getCurrentData().condition.toLowerCase()}`)}</Text>
          </View>
          <MeteoMetrics data={getCurrentHourMetrics()} currentProduct={products[0]} />
          
          <MeteoSlider currentHour={currentHour} setCurrentHour={setCurrentHour} data={getCurrentDayData()} />

          <View style={styles.topWhiteContainer}>
            <MeteoWhiteStatus currentCondition={getCurrentData().condition} parcelles={getCurrentData().parcelle} />
          </View>

          { selected && (
            <MeteoMapHeaderSelected selected={selected} data={getCurrentData().parcelle[selected]} isRacinaire={products[0].isRacinaire} currentCondition={getCurrentData().condition} />
          )}
          { !selected && (
            <MeteoMapHeader selected={selected} data={getCurrentData().parcelle} isRacinaire={products[0].isRacinaire} currentCondition={getCurrentData().condition} />
          )}

          <View style={styles.mapviewContainer}>
            <Map region={region} parcelles={parcelles} selected={selected} setSelected={setSelected} currentData={getCurrentData().parcelle} />
          </View>

          <MapLegend />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent'
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
    fontSize: 20
  },  
  container: {
    display: 'flex',
  },
  details: {
    backgroundColor: 'transparent',
    display: 'flex',
    paddingTop: 20,
    justifyContent: 'center',
    flex: 1,
  },
  productName: {
    padding: 10,
    fontFamily: 'nunito-bold',
    textTransform: 'uppercase',
    fontSize: 14,
    color: '#fff',
  },
  currentCondition: {
    padding: 10,
    fontFamily: 'nunito-heavy',
    textTransform: 'uppercase',
    fontSize: 14,
    color: '#fff',
  },
  topWhiteContainer: {
    paddingRight: 15,
    paddingBottom: 0
  }, 
  mapviewContainer: {
    top: -20,
  },
});
  
export default MeteoDetailedDetails


