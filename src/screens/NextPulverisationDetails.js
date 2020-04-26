import React, { useState, useRef, createRef, useEffect } from 'react';
import { SafeAreaView } from 'react-navigation';
import { ScrollView, StyleSheet, View, StatusBar, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Button, Icon, Text, Left, Right, Body, Header, Title, Spinner } from 'native-base';
import  MapView, {Polygon} from 'react-native-maps';

import { getModulationValue } from '../api/hygoApi'

import { connect } from 'react-redux'

import COLORS from '../colors'
import i18n from 'i18n-js'

import _ from 'lodash'

import HygoParcelleIntervention from '../components/HygoParcelleIntervention'
import { TouchableOpacity } from 'react-native-gesture-handler';

import { PADDED, CONDITIONS_ORDERING } from '../constants'

const NextPulverisationDetails = ({ result, day, hour, ra, next12HoursData, navigation, culturesSelected, phytoProductSelected, cultures, phytoProductList }) => {
  const [modulationValue, setModulationValue] = useState()
  const [modulationLoading, setModulationLoading] = useState(false)
  const [modulationChanged, setModulationChanged] = useState(true)

  const [loading, setLoading] = useState(false)

  const openPicker = (screen) => {
    navigation.replace(screen, {
      next: 'Pulverisation',
      back: 'Pulverisation'
    })
  }

  const [selected, setSelected] = useState({
    min: 0,
    max: ra ? parseInt(ra) : 0,
  })

  const polygons = useRef([]);
  if (polygons.current.length !== result.parcelles.length) {
    polygons.current = Array(result.parcelles.length).fill().map((_, i) => polygons.current[i] || createRef())
  }

  const [currentHourMetrics, setCurrentHourMetrics] = useState({})
  const [background, setBackground] = useState(COLORS.GREY)
  const [fieldColors, setFieldColors] = useState({})

  const reloadCurrentMetrics = (selected) => {
    const minval = -99999, maxval = 99999
    let chd = {}, dir = []
    _.forOwn(next12HoursData, (v, k) => {
      if (k === 'ready') { return }
      if (parseInt(k) - parseInt(hour) > selected.max || parseInt(k) - parseInt(hour) < selected.min) {
        return
      }

      chd.wind = Math.max((chd.wind || minval), v.data.wind)
      chd.gust = Math.max((chd.gust || minval), v.data.gust)

      chd.precipitation = (chd.precipitation||0) + v.data.precipitation
      chd.probabilityCnt = (chd.probabilityCnt||0) + 1
      chd.probabilitySum = (chd.probabilitySum||0) + parseFloat(v.data.probability)

      chd.mintemp = Math.min((chd.mintemp || maxval), v.data.mintemp)
      chd.maxtemp = Math.max((chd.maxtemp || minval), v.data.maxtemp)

      chd.minhumi = Math.min((chd.minhumi || maxval), v.data.minhumi)
      chd.maxhumi = Math.max((chd.maxhumi || minval), v.data.maxhumi)

      chd.minsoilhumi = Math.min((chd.minsoilhumi || maxval), v.data.soilhumi)
      chd.maxsoilhumi = Math.max((chd.maxsoilhumi || minval), v.data.soilhumi)

      dir.push(v.data.winddirection)
    })

    chd.winddirection = _.head(_(dir).countBy().entries().maxBy(_.last));

    chd.probability = chd.probabilityCnt > 0 ? chd.probabilitySum / chd.probabilityCnt : 0.0

    setCurrentHourMetrics(chd)
  }

  useEffect(() => {
    reloadCurrentMetrics(selected)
    setBackgroundColor(selected)
  }, [next12HoursData])

  const hasRacinaire = () => {
    return result.products.filter(p => p.isRacinaire).length > 0
  }

  const setBackgroundColor = (selected) => {
    let curCond = null
    for (let i = selected.min; i <= selected.max; i++) {
      if (!curCond || CONDITIONS_ORDERING[curCond] >= CONDITIONS_ORDERING[next12HoursData[PADDED[i+parseInt(hour)]].condition]) {
        curCond = next12HoursData[PADDED[i+parseInt(hour)]].condition
      }
    }

    setBackground(COLORS[`${curCond}`])

    let fc = {}
    Object.values(result.parcelles).map((field, idx) => {
      fc[field.id] = getFieldColor(selected, field.id)
    })
    setFieldColors(fc)
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

  const getFieldColor = (selected, fieldId) => {
    let curCond = null
    for (let i = selected.min; i <= selected.max; i++) {
      let padded = PADDED[i+parseInt(hour)]
      if (!curCond || CONDITIONS_ORDERING[curCond] >= CONDITIONS_ORDERING[next12HoursData[padded].parcelle[fieldId].condition]) {
        if (next12HoursData[padded].parcelle[fieldId]) {
          curCond = next12HoursData[padded].parcelle[fieldId].condition
        }
      }
    }

    if (curCond === null) {
      return COLORS.DEFAULT_FIELD
    }

    return COLORS[`${curCond}_CARDS`]
  }

  const getHour = (i) => {
    let h = (parseInt(hour) + i) % 24
    return  `${`${h}`.padStart(2, '0')}H`
  }

  const getWidth = () => {
    return (Dimensions.get('window').width - 30) / 12
  }

  const updateModulation = async () => {
    setModulationLoading(true)

    let params = {
      products: phytoProductSelected,
      cultures: culturesSelected,
      selected,
    }

    let res = await getModulationValue({
      ...params,
      day,
      hour,
    })

    setModulationValue(res.value)

    setModulationChanged(false)
    setModulationLoading(false)
  }

  return (
    <SafeAreaView style={[styles.statusbar, { backgroundColor: background }]} forceInset={{top:'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <Header hasTabs style={[styles.header, { backgroundColor: background }]} androidStatusBarColor={background} iosBarStyle="light-content">
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => navigation.navigate("Pulverisation")}>
              <Icon name='close' style={{ color: '#fff' }} />
            </Button>
          </Left>
          <Body style={styles.headerBody}>
            <Title style={styles.headerTitle}>{i18n.t('meteo_overlay.header', { from: (parseInt(hour)+selected.min)%24, to: (parseInt(hour)+selected.max+1)%24 })}</Title>
          </Body>
          <Right style={{ flex: 1 }}></Right>
        </Header>

        <View style={styles.pulveContainer}>
          <TouchableWithoutFeedback onPress={() => openPicker("HygoCulturePicker")}>
            <View style={styles.picker}>
            { culturesSelected.length === 0 && (
              <Text style={styles.pickerText}>{i18n.t('pulverisation.culture_type')}</Text>
            )}
            { culturesSelected.length === cultures.length && (
              <Text style={styles.pickerText}>{i18n.t('pulverisation.all_cultures')}</Text>
            )}
            { culturesSelected.length < cultures.length && culturesSelected.length > 0 && (
              <Text style={styles.pickerText}>{ cultures.filter(pp => culturesSelected.indexOf(pp.id) > -1).map(pp => pp.name).join(', ') }</Text>
            )}
            <Icon style={styles.pickerIcon} type="Feather" name="chevron-down" />
            </View>
          </TouchableWithoutFeedback>

          <View style={{ height: 10 }}></View>

          <TouchableWithoutFeedback onPress={() => openPicker("HygoProductPicker")}>
            <View style={styles.picker}>
              { phytoProductSelected.length === 0 && (
                <Text style={styles.pickerText}>{i18n.t('pulverisation.product_type')}</Text>
              )}
              { phytoProductSelected.length > 0 && (
                <Text style={styles.pickerText}>{ phytoProductList.filter(pp => phytoProductSelected.indexOf(pp.id) > -1).map(pp => pp.name).join(', ') }</Text>
              )}
              <Icon style={styles.pickerIcon} type="Feather" name="chevron-down" />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.details}>
          <View style={styles.conditionContainer}>
            <View style={styles.conditionItemContainer}>
              <Image source={require('../../assets/ICN-Wind.png')} style={styles.conditionItemImage} />
              { loading && (
                <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
              )}

              { !loading && (
                <View>
                  <Text style={styles.conditionItemText}>{`${currentHourMetrics.winddirection} ${Math.round(currentHourMetrics.wind)} km/h`}</Text>
                  <Text style={styles.conditionItemText}>{`RAF ${Math.round(currentHourMetrics.gust)} km/h`}</Text>
                </View>
              )}
            </View>
            <View style={styles.conditionItemContainer}>
              <Image source={require('../../assets/ICN-Rain.png')} style={styles.conditionItemImage} />
              <Text style={styles.conditionItemText}>{`${currentHourMetrics.precipitation} mm`}</Text>
              <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(currentHourMetrics.probability))}%`}</Text>
            </View>
            <View style={styles.conditionItemContainer}>
              <Image source={require('../../assets/ICN-Temperature.png')} style={styles.conditionItemImage} />
              <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(currentHourMetrics.mintemp))}°C`}</Text>
              <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(currentHourMetrics.maxtemp))}°C`}</Text>
            </View>
            <View style={styles.conditionItemContainer}>
              <Image source={require('../../assets/ICN-Hygro.png')} style={styles.conditionItemImage} />
              <Text style={styles.conditionItemText}>{`${currentHourMetrics.minhumi}%`}</Text>
              <Text style={styles.conditionItemText}>{`${currentHourMetrics.maxhumi}%`}</Text>
            </View>
            { hasRacinaire() && (
              <View style={styles.conditionItemContainer}>
                <Image source={require('../../assets/sprout.png')} style={styles.conditionItemImage} />
                <Text style={styles.conditionItemText}>{`${Math.round(currentHourMetrics.soilhumi)}%`}</Text>
                <Text style={styles.conditionItemText}>{`${Math.round(currentHourMetrics.soiltemp)}°C`}</Text>
              </View>
            )}
          </View>
          <View style={styles.sliderContainer}>
            <HygoParcelleIntervention from={parseInt(hour)} initialMax={selected.max} onHourChangeEnd={(h) => {
              setModulationChanged(true)
              setSelected(h);

              if (h.max < h.min) {
                return
              }
              reloadCurrentMetrics(h)
              setBackgroundColor(h)
              setLoading(false)
            }} data={next12HoursData} width={Dimensions.get('window').width - 30} />
          </View>
          <View style={styles.hoursDetailsContainer}>
            <Text style={[styles.hoursDetails, { left: 0 * getWidth()}]}>{getHour(0)}</Text>
            <Text style={[styles.hoursDetails, { left: 6 * getWidth()}]}>{getHour(6)}</Text>
            <Text style={[styles.hoursDetails, { left: 11 * getWidth()}]}>{getHour(11)}</Text>
          </View>
          <View style={styles.modulation}>
            <View style={styles.modulationContainer}>
              <View style={styles.modulationTextContaier}>
                <Text style={styles.modulationTextInfo}>{i18n.t('pulverisation.reduce_dosage')}</Text>
                <View style={styles.modulationBlock}>
                  { modulationChanged && modulationLoading && (
                      <Spinner style={styles.modulationSpinner} />
                  )}
                  { modulationChanged && !modulationLoading && (
                      <TouchableWithoutFeedback onPress={updateModulation}><Icon type="MaterialCommunityIcons" name="refresh" style={styles.modulationRefresh} /></TouchableWithoutFeedback>
                  )}
                  { !modulationChanged && (
                    <Text style={styles.modulationTextValue}>{`${modulationValue}%`}</Text>
                  )}
                </View>
              </View>
              <Text style={styles.modulationTextStar}>{i18n.t('pulverisation.computation_hint')}</Text>
            </View>
          </View>
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
                    strokeWidth={1}
                    strokeColor={COLORS.DARK_GREEN}
                    fillColor={fieldColors[field.id]}
                    ref={ref => (polygons.current[idx] = ref)}
                    onLayout={() => polygons.current[idx].setNativeProps({
                        fillColor: fieldColors[field.id]
                    })}
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RealTime')}>
              <Icon type='AntDesign' name='arrowright' style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{i18n.t('pulverisation.start')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modulation: {
    backgroundColor: COLORS.BEIGE,
    paddingRight: 15,
  },
  modulationContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  modulationTextContaier: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modulationTextInfo: {
    color: COLORS.DARK_BLUE,
    fontFamily: 'nunito-bold',
    fontSize: 16
  },
  modulationBlock: {
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modulationTextValue: {
    marginLeft: 27,
    color: '#8bdf8b',
    fontFamily: 'nunito-bold',
    fontSize: 48,
  },
  modulationRefresh: {
    marginLeft: 27,
    color: '#8bdf8b',
    fontSize: 48,
  },
  modulationTextStar: {
    fontSize: 12,
    fontFamily: 'nunito-heavy',
    color: '#aaaaaa',
    marginBottom: 30,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: COLORS.DARK_BLUE,
    padding: 20,
    paddingHorizontal: 40,
    borderRadius: 40,
    flexDirection: 'row',
    display: 'flex',
  },
  buttonIcon: {
    color: '#fff',
    fontSize: 26,
    marginRight: 20
  },
  buttonText: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 18,
    fontFamily: 'nunito-heavy'
  },
  header: {
    backgroundColor: 'transparent'
  },
  hoursDetailsContainer: {
    flexDirection: 'row',
    display: 'flex',
    marginBottom: 50,
    marginHorizontal: 15
  },
  hoursDetails: {
    fontFamily: 'nunito-bold',
    fontSize: 12,
    color: '#fff',
    position: 'absolute'
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
    backgroundColor: '#fff'
  },
  map: {
    top: -20,
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
  },
  pulveContainer: {
    paddingRight: 15,
    paddingTop: 30,
    paddingBottom: 10,
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
    color: COLORS.DARK_GREEN,
    fontSize: 16,
    fontFamily: 'nunito-bold',
  },
  pickerIcon: {
    marginLeft: 5,
    fontSize: 20,
    color: COLORS.DARK_GREEN
  },
});
  
const mapStateToProps = (state) => ({
  cultures: state.metadata.cultures,
  phytoProductList: state.pulve.phytoProductList,
  culturesSelected: state.pulve.culturesSelected,
  phytoProductSelected: state.pulve.phytoProductSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(NextPulverisationDetails);