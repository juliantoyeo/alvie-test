import React, { useState, useRef, createRef } from 'react';
import { SafeAreaView } from 'react-navigation';
import { ScrollView, StyleSheet, View, StatusBar, Image, Dimensions } from 'react-native';
import { Button, Icon, Text, Left, Right, Body, Header, Title } from 'native-base';
import  MapView, {Polygon} from 'react-native-maps';

import COLORS from '../colors'
import i18n from 'i18n-js'

import HygoParcelleSlider from '../components/HygoParcelleSlider'

const MeteoDetailedDetails = ({ navigation }) => {
  let result = navigation.getParam('result')

  const [selected, setSelected] = useState(null)

  const polygons = useRef([]);
  if (polygons.current.length !== result.length) {
    polygons.current = Array(result.length).fill().map((_, i) => polygons.current[i] || createRef())
  }

  const [currentHour, setCurrentHour] = useState(10)
  const [currentDay, setCurrentDay] = useState(result.days[0])
  const [currentProduct, setCurrentProduct] = useState(result.products[0])

  const getCurrentData = () => {
    let padded = `${currentHour}`.padStart(2, '0')
    return result.data[currentDay].hours1[`${currentProduct.id}`].data[`${padded}`]
  }

  const getCurrentParcelles = () => {
    let padded = `${currentHour}`.padStart(2, '0')
    return result.data[currentDay].hours1[`${currentProduct.id}`].data[`${padded}`].parcelle
  }

  const getCurrentHourMetrics = () => {
    let padded = `${currentHour}`.padStart(2, '0')
    return result.data[padded].data
  }

  const getBackground = () => {
    return COLORS[`${getCurrentData().condition}`]
  }

  const getRegion = () => {
    let center = {
      longitude: (result.region.lon_max - result.region.lon_min) / 2 + result.region.lon_min,
      latitude: (result.region.lat_max - result.region.lat_min) / 2 + result.region.lat_min,
    }

    let r = {
      ...center,
      longitudeDelta: Math.max(0.0222, Math.abs(result.region.lon_max - center.longitude)),
      latitudeDelta: Math.max(0.0121, Math.abs(result.region.lat_max - center.latitude)),
    }

    return r
  }

  const getTextForWhitePanel = () => {
    let conditions = { EXCELLENT: [], GOOD: [], CORRECT: [], BAD: [], FORBIDDEN: [] }
    let parcelles = getCurrentParcelles(), pk = Object.keys(parcelles)
    for (let i = 0; i < pk.length; i++) {
      conditions[parcelles[pk[i]].condition].push(i)
    }

    if (getCurrentData().condition === 'EXCELLENT' && conditions.EXCELLENT.length === pk.length) {
      return i18n.t(`meteo_overlay.white_${getCurrentData().condition}_everywhere`)
    } else if (getCurrentData().condition === 'EXCELLENT') {
      return i18n.t(`meteo_overlay.white_${getCurrentData().condition}_some`, { 
        value: Math.round(parseFloat(conditions.EXCELLENT.length) / pk.length * 100)
      })
    } else if (getCurrentData().condition === 'GOOD' && conditions.GOOD.length === pk.length) {
      return i18n.t(`meteo_overlay.white_${getCurrentData().condition}_everywhere`)
    } else if (getCurrentData().condition === 'GOOD') {
      return i18n.t(`meteo_overlay.white_${getCurrentData().condition}_some`, { 
        value: Math.round(parseFloat(conditions.GOOD.length + conditions.EXCELLENT.length) / pk.length * 100)
      })
    } else if (getCurrentData().condition === 'CORRECT' && conditions.CORRECT.length === pk.length) {
      return i18n.t(`meteo_overlay.white_${getCurrentData().condition}_everywhere`)
    } else if (getCurrentData().condition === 'CORRECT') {
      return i18n.t(`meteo_overlay.white_${getCurrentData().condition}_some`, { 
        value: Math.round(parseFloat(conditions.CORRECT.length + conditions.GOOD.length + conditions.EXCELLENT.length) / pk.length * 100)
      })
    } else if (conditions.FORBIDDEN.length + conditions.BAD.length === pk.length) {
      if (conditions.BAD.length !== 0) {
        return i18n.t(`meteo_overlay.white_BAD_everywhere`)
      } else {
        return i18n.t(`meteo_overlay.white_FORBIDDEN_everywhere`)
      }
    }
  }

  return (
    <SafeAreaView style={[styles.statusbar, { backgroundColor: getBackground() }]} forceInset={{top:'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView style={[styles.container, { backgroundColor: getBackground() }]}>
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
            <Text style={styles.productName}>{ currentProduct.name }</Text>
            <Text style={styles.currentCondition}>{i18n.t(`intervention_map.${getCurrentData().condition.toLowerCase()}`)}</Text>
          </View>
          <View style={styles.conditionContainer}>
            <View style={styles.conditionItemContainer}>
              <Image source={require('../../assets/ICN-Wind.png')} style={styles.conditionItemImage} />
              <Text style={styles.conditionItemText}>{`${getCurrentHourMetrics().winddirection} ${Math.round(getCurrentHourMetrics().wind)} km/h`}</Text>
              <Text style={styles.conditionItemText}>{`RAF ${Math.round(getCurrentHourMetrics().gust)} km/h`}</Text>
            </View>
            <View style={styles.conditionItemContainer}>
              <Image source={require('../../assets/ICN-Rain.png')} style={styles.conditionItemImage} />
              <Text style={styles.conditionItemText}>{`${getCurrentHourMetrics().precipitation} mm`}</Text>
              <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(getCurrentHourMetrics().probability))}%`}</Text>
            </View>
            <View style={styles.conditionItemContainer}>
              <Image source={require('../../assets/ICN-Temperature.png')} style={styles.conditionItemImage} />
              <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(getCurrentHourMetrics().mintemp))}°C`}</Text>
              <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(getCurrentHourMetrics().maxtemp))}°C`}</Text>
            </View>
            <View style={styles.conditionItemContainer}>
              <Image source={require('../../assets/ICN-Hygro.png')} style={styles.conditionItemImage} />
              <Text style={styles.conditionItemText}>{`${getCurrentHourMetrics().minhumi}%`}</Text>
              <Text style={styles.conditionItemText}>{`${getCurrentHourMetrics().maxhumi}%`}</Text>
            </View>
            { currentProduct.isRacinaire && (
              <View style={styles.conditionItemContainer}>
                <Image source={require('../../assets/sprout.png')} style={styles.conditionItemImage} />
                <Text style={styles.conditionItemText}>{`${Math.round(getCurrentHourMetrics().soilhumi)}%`}</Text>
                <Text style={styles.conditionItemText}>{`${Math.round(getCurrentHourMetrics().soiltemp)}°C`}</Text>
              </View>
            )}
          </View>
          <View style={styles.sliderContainer}>
            <HygoParcelleSlider start={currentHour} onHourChange={(i) => setCurrentHour(i) } data={result.data[currentDay].hours1[`${currentProduct.id}`].data} width={Dimensions.get('window').width - 30} />
          </View>
          <View style={styles.hoursContainer}>
            <Text style={styles.hours}>00H</Text>
            <Text style={styles.hours}>08H</Text>
            <Text style={styles.hours}>16H</Text>
            <Text style={styles.hours}>24H</Text>
          </View>
          <View style={styles.topWhiteContainer}>
            <View style={styles.whiteContainer}>
              <Text style={styles.whiteText}>{getTextForWhitePanel()}</Text>
            </View>
          </View>
          { selected && (
            <>
            <View style={[styles.metricsContainer, { backgroundColor: COLORS[`${getCurrentData().condition}_CARDS`]}]}>
              <View style={styles.metricsLine}>
                <Text style={[styles.metricsText]}>{i18n.t('meteo_overlay.hygro', { value: Math.round(parseFloat(getCurrentParcelles()[selected].humi)) })}</Text>
                <Text style={[styles.metricsText]}>{i18n.t('meteo_overlay.precipitation', { value: getCurrentParcelles()[selected].precipitation })}</Text>
                { currentProduct.isRacinaire && (
                  <Text style={[styles.metricsText]}>{""}</Text>
                )}
              </View>
              <View style={styles.metricsLine}>
                <Text style={[styles.metricsText]}>{i18n.t('meteo_overlay.temp', { value: Math.round(parseFloat(getCurrentParcelles()[selected].temp)) })}</Text>
                <Text style={styles.metricsText}>{`${i18n.t('meteo_overlay.wind')} ${i18n.t('meteo_overlay.wind_speed', { value: Math.round(getCurrentParcelles()[selected].wind) })}`}</Text>
                { currentProduct.isRacinaire && (
                  <Text style={styles.metricsText}>{`${i18n.t('meteo_overlay.soil')} ${i18n.t('meteo_overlay.soil_humi', { value: Math.round(getCurrentParcelles()[selected].soilhumi) })}`}</Text>
                )}
              </View>
              <View style={[styles.metricsLine, {flex:1}]}>
                <Text style={[styles.metricsText]}>{i18n.t('meteo_overlay.delta_temp', { value: Math.round(getCurrentParcelles()[selected].deltatemp) })}</Text>
                <Text style={styles.metricsText}>{i18n.t('meteo_overlay.wind_gust', { value: Math.round(getCurrentParcelles()[selected].gust) })}</Text>
                { currentProduct.isRacinaire && (
                  <Text style={styles.metricsText}>{i18n.t('meteo_overlay.soil_temp', { value: Math.round(getCurrentParcelles()[selected].soiltemp) })}</Text>
                )}  
                </View>
            </View>
            <View style={styles.carretContainer}>
              <View style={[styles.triangle, { borderBottomColor: COLORS[`${getCurrentData().condition}_CARDS`] }]} />
            </View>
            </>
          )}
          { selected === null && (
            <View style={styles.mapHeader}>
              <Icon type="MaterialIcons" name="info-outline" style={styles.mapHeaderIcon} />
              <Text style={styles.mapHeaderText}>{i18n.t('meteo_overlay.map_header', { value: i18n.t(`intervention_map.${getCurrentData().condition.toLowerCase()}`)})}</Text>
            </View>
          )}
          <View style={styles.mapviewContainer}>
            <MapView
              provider="google"
              mapType="hybrid"
              initialRegion={getRegion()}
              style={styles.map}>

              { Object.values(result.parcelles).map((field, idx) => {
                return (
                  <Polygon
                    key={field.id}
                    strokeWidth={selected === field.id ? 4 : 1}
                    strokeColor={selected === field.id ? '#fff' : COLORS.DARK_GREEN}
                    fillColor={COLORS[`${getCurrentParcelles()[field.id].condition}_CARDS`]}
                    ref={ref => (polygons.current[idx] = ref)}
                    onLayout={() => polygons.current[idx].setNativeProps({
                        fillColor: COLORS[`${getCurrentParcelles()[field.id].condition}_CARDS`]
                    })}
                    tappable={true}
                    onPress={() => {
                      let i = field.id
    
                      let newValue = selected === i ? null : i
                      setSelected(newValue)
                    }}
                    coordinates={field.features.coordinates[0].map((coordinate) => {
                      return {
                        latitude: coordinate[1],
                        longitude: coordinate[0],
                      }
                    })}
                  />  
                );
              })}
            </MapView>
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendElement}>
              <View style={[styles.legendColor, {backgroundColor: COLORS.EXCELLENT_CARDS}]}></View>
              <Text style={styles.legendText}>{i18n.t('meteo_overlay.excellent')}</Text>
            </View>
            <View style={styles.legendElement}>
              <View style={[styles.legendColor, {backgroundColor: COLORS.GOOD_CARDS}]}></View>
              <Text style={styles.legendText}>{i18n.t('meteo_overlay.good')}</Text>
            </View>
            <View style={styles.legendElement}>
              <View style={[styles.legendColor, {backgroundColor: COLORS.CORRECT_CARDS}]}></View>
              <Text style={styles.legendText}>{i18n.t('meteo_overlay.correct')}</Text>
            </View>
            <View style={styles.legendElement}>
              <View style={[styles.legendColor, {backgroundColor: COLORS.BAD_CARDS}]}></View>
              <Text style={styles.legendText}>{i18n.t('meteo_overlay.bad')}</Text>
            </View>
            <View style={styles.legendElement}>
              <View style={[styles.legendColor, {backgroundColor: COLORS.FORBIDDEN_CARDS}]}></View>
              <Text style={styles.legendText}>{i18n.t('meteo_overlay.forbidden')}</Text>
            </View>
          </View>
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
  conditionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
    paddingTop: 20,
  },
  conditionItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionItemImage: {
    width: 24,
    resizeMode: 'contain',
    tintColor: '#fff',
    marginBottom: 10,
  },
  conditionItemText: {
    fontFamily: 'nunito-bold',
    fontSize: 14,
    color: '#fff',
  },
  sliderContainer: {
    marginTop: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hoursContainer: { 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15,
    marginBottom: 30 
  },
  hours: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'nunito-heavy'
  },
  topWhiteContainer: {
    paddingRight: 15,
    paddingBottom: 0
  }, 
  whiteContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: 30,
    paddingVertical: 27,
    paddingHorizontal: 34,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOpacity: .2,
    shadowOffset: {
      width: 0,
      height: 3
    },
    elevation: 3
  },
  whiteText: {
    fontFamily: 'nunito-italic',
    fontSize: 16,
    color: COLORS.DARK_GREEN
  },
  mapHeader: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 30,
    paddingRight: 30,
    paddingLeft: 15,
    paddingBottom: 50,
  },
  mapHeaderIcon: {
    color: '#fff',
    fontSize: 26,
    marginRight: 10,
  },
  mapHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'nunito-bold',
    flex: 1,
  },
  mapviewContainer: {
    top: -20,
  },
  map: {
    justifyContent :"center",
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    height : Dimensions.get('window').width,
  },
  legendContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 15,
  },
  legendElement: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    height: 20,
    width: 10,
    marginRight: 5,
  },
  metricsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricsLine: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    paddingHorizontal: 5,
  },
  metricsText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'nunito-bold',
    paddingVertical: 5
  },
  metricsWind: {
    display: 'flex',
    flexDirection: 'row'
  },
  carretContainer: {
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    zIndex: 5,
  },
  triangle: {
    zIndex: 5,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [
      {rotate: '180deg'}
    ]
  }
});
  
export default MeteoDetailedDetails


