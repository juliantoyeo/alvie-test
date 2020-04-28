import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-navigation';
import { ScrollView, StyleSheet, View, StatusBar, Image, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { Button, Icon, Text, Left, Right, Body, Header, Title } from 'native-base';

import COLORS from '../colors'
import i18n from 'i18n-js'

import HygoMap from '../components/HygoMap'
import { updateIntervention } from '../api/hygoApi';

import { updateProductsInterv } from '../store/actions/intervActions'

import moment from 'moment-timezone'

const InterventionMapScreen = ({ navigation, phytoProductList, updateProductsInterv }) => {
  let intervention = navigation.getParam('intervention')

  const [field, setField] = useState(null)

  const getPhyto = () => {
    if (intervention.products) {
      return intervention.products
    } else if (intervention.phytoproduct) {
      return phytoProductList.filter(pp => pp.name === intervention.phytoproduct).map(p => p.id)
    }

    return []
  }

  const getPhytoText = () => {
    if (products && products.length > 0) {
      let ptext = []
      if (products.indexOf(-1) > -1) {
        ptext.push(i18n.t('intervention_map.other_farm_work'))
      }

      ptext = ptext.concat(phytoProductList.filter(pp => products.includes(pp.id)).map(p => i18n.t(`products.${p.name}`)))
      return i18n.t('intervention_map.header_phyto', { phyto: ptext.join(', ') })
    } else if (intervention.phytoproduct) {
      return i18n.t('intervention_map.header_phyto', { phyto: intervention.phytoproduct })
    }

    return i18n.t('intervention_map.header_phyto', { phyto: i18n.t('intervention.no_phyto_selected') })
  }

  const setProducts = (p) => {
    updateIntervention(p, intervention.interventionid)
    updateProductsInterv(p, intervention.id)
    setCurrentProducts(p)
  }
  const [products, setCurrentProducts] = useState(getPhyto())

  const getDay = useCallback(() => {
    return moment.utc(intervention.starttime).tz('Europe/Paris').format('DD/MM')
  }, [intervention.starttime])

  const getStartHour = useCallback(() => {
    return moment.utc(intervention.starttime).tz('Europe/Paris').format('HH:mm')
  }, [intervention.starttime])

  const getEndHour = useCallback(() => {
    return moment.utc(intervention.endtime).tz('Europe/Paris').format('HH:mm')
  }, [intervention.endtime])

  const getTotalArea = () => {
    let fields = intervention.fields
    if (!fields) {
      return 0
    }

    let area = 0.0
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].Parcelle) {
        continue
      }
      area += fields[i].Parcelle.area
    }

    return (area / 10000).toFixed(1)
  }

  const handleFieldSelection = (field) => {
    if (!field) {
      setField(null)
      return
    }
    setField(field)
  }

  if (!intervention.avgtemp) {
    return (<View></View>)
  }

  return (
    <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView style={styles.container}>
        <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name='close' style={{ color: '#fff' }} />
            </Button>
          </Left>
          <Body style={styles.headerBody}>
            <Title style={styles.headerTitle}>{i18n.t('intervention_map.header', { date: getDay()})}</Title>
          </Body>
          <Right style={{ flex: 1 }}></Right>
        </Header>

        <View style={styles.phytoDetail}>
          <View style={styles.phytoDetailRow}>
            <Image style={[styles.phytoDetailImage, { height: 28 }]} source={require('../../assets/phyto.png')} />
            <TouchableWithoutFeedback onPress={() => navigation.navigate("HygoProductPicker", { source: 'intervention', set: setProducts, initial: products })}>
              <View style={styles.picker}>
                <Text style={styles.phytoDetailText}>{getPhytoText()}</Text>
                <Icon style={styles.pickerIcon} type="Feather" name="chevron-down" />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.phytoDetailRow}>
            <Image style={styles.phytoDetailImage} source={require('../../assets/clock.png')} />
            <Text style={styles.phytoDetailText}>{i18n.t('intervention_map.header_clock', { start: getStartHour(), end: getEndHour() })}</Text>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metrics}>
            { typeof intervention.avgwind !== 'undefined' && (
              <View style={styles.elem}>
                <Image source={require('../../assets/ICN-Wind.png')} style={styles.elemIcon} />
                <Text style={styles.big}>{`${Math.round(intervention.avgwind)} km/h`}</Text>
                <Text style={styles.mini}>{`min ${Math.round(intervention.minwind)} km/h`}</Text>
                <Text style={styles.mini}>{`max ${Math.round(intervention.maxwind)} km/h`}</Text>
              </View>
            )}
            { typeof intervention.precipitation !== 'undefined' && (
              <View style={styles.elem}>
                <Image source={require('../../assets/ICN-Rain.png')} style={styles.elemIcon} />
                <Text style={styles.big}>{`${Math.round(intervention.precipitation)} mm`}</Text>
              </View>
            )}
            <View style={styles.elem}>
              <Image source={require('../../assets/ICN-Temperature.png')} style={styles.elemIcon} />
              <Text style={styles.big}>{`${intervention.avgtemp.toFixed(1)}°C`}</Text>
              <Text style={styles.mini}>{i18n.t('intervention_map.min', { value: `${intervention.mintemp.toFixed(1)}°C`})}</Text>
              <Text style={styles.mini}>{i18n.t('intervention_map.max', { value: `${intervention.maxtemp.toFixed(1)}°C`})}</Text>
            </View>
            <View style={styles.elem}>
              <Image source={require('../../assets/ICN-Hygro.png')} style={styles.elemIcon} />
              <Text style={styles.big}>{`${Math.round(intervention.avghumi)}%`}</Text>
              <Text style={styles.mini}>{i18n.t('intervention_map.min', { value: `${Math.round(intervention.minhumi)}%`})}</Text>
              <Text style={styles.mini}>{i18n.t('intervention_map.max', { value: `${Math.round(intervention.maxhumi)}%`})}</Text>
            </View>
          </View>

          <Text style={styles.metricsSurface}>{i18n.t('intervention_map.surface', { surface: getTotalArea() })}</Text>
        </View>

        { field === null && (
          <View style={styles.legend}>
            <View style={[styles.legendLine, { backgroundColor: COLORS.EXCELLENT }]}>
              <Text style={styles.legendText}>{i18n.t('intervention_map.excellent')}</Text>
            </View>
            <View style={[styles.legendLine, { backgroundColor: COLORS.GOOD }]}>
              <Text style={styles.legendText}>{i18n.t('intervention_map.good')}</Text>
            </View>
            <View style={[styles.legendLine, { backgroundColor: COLORS.CORRECT }]}>
              <Text style={styles.legendText}>{i18n.t('intervention_map.mediocre')}</Text>
            </View>
            <View style={[styles.legendLine, { backgroundColor: COLORS.BAD }]}>
              <Text style={styles.legendText}>{i18n.t('intervention_map.bad')}</Text>
            </View>
            <View style={[styles.legendLine, { backgroundColor: COLORS.FORBIDDEN }]}>
              <Text style={styles.legendText}>{i18n.t('intervention_map.forbidden')}</Text>
            </View>
          </View>
        )}

        { field !== null && (
          <>
            <View style={[styles.selected, { backgroundColor: field.colorField === COLORS.DEFAULT_FIELD ? COLORS.BAD : field.colorField }]}>
              <View style={styles.selectedLine}>
                <View style={styles.selectedElem}>
                  <View style={styles.selectedImageContainer}>
                    <Image source={require('../../assets/ICN-Temperature.png')} style={styles.selectedImage} />
                  </View>
                  <View style={styles.selectedTextContainer}>
                    <Text style={styles.selectedText}>{i18n.t('intervention_map.avg', { value: `${field.avgtemp.toFixed(1)}°C`})}</Text>
                    <Text style={styles.selectedText}>{i18n.t('intervention_map.min', { value: `${field.mintemp.toFixed(1)}°C`})}</Text>
                    <Text style={styles.selectedText}>{i18n.t('intervention_map.max', { value: `${field.maxtemp.toFixed(1)}°C`})}</Text>
                  </View>
                </View>
                { (typeof field.avgwind !== 'undefined' || typeof field.precipitation !== 'undefined') && (
                  <View style={[styles.selectedElem, { marginTop: 20 }]}>
                    <View style={styles.selectedImageContainer}>
                      <Image source={require('../../assets/ICN-Wind.png')} style={styles.selectedImage} />
                    </View>
                    <View style={styles.selectedTextContainer}>
                      <Text style={styles.selectedText}>{i18n.t('intervention_map.avg', { value: `${field.avgtemp.toFixed(1)} km/h`})}</Text>
                      <Text style={styles.selectedText}>{i18n.t('intervention_map.min', { value: `${field.mintemp.toFixed(1)} km/h`})}</Text>
                      <Text style={styles.selectedText}>{i18n.t('intervention_map.max', { value: `${field.maxtemp.toFixed(1)} km/h`})}</Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={[styles.selectedLine]}>
                { typeof field.avgwind !== 'undefined' && (
                  <View style={[styles.selectedElem, { marginBottom: 20 }]}>
                    <View style={styles.selectedImageContainer}>
                      <Image source={require('../../assets/ICN-Hygro.png')} style={styles.selectedImage} />
                    </View>
                    <View style={styles.selectedTextContainer}>
                      <Text style={styles.selectedText}>{i18n.t('intervention_map.avg', { value: `${Math.round(field.avghumi)}%`})}</Text>
                      <Text style={styles.selectedText}>{i18n.t('intervention_map.min', { value: `${Math.round(field.minhumi)}%`})}</Text>
                      <Text style={styles.selectedText}>{i18n.t('intervention_map.max', { value: `${Math.round(field.maxhumi)}%`})}</Text>
                    </View>
                  </View>
                )}
                { typeof field.precipitation !== 'undefined' && (
                  <View style={[styles.selectedElem]}>
                    <View style={styles.selectedImageContainer}>
                      <Image source={require('../../assets/ICN-Rain.png')} style={styles.selectedImage} />
                    </View>
                    <View style={styles.selectedTextContainer}>
                      <Text style={styles.selectedText}>{i18n.t('intervention_map.rain', { value: `${Math.round(field.precipitation)} mm`})}</Text>
                    </View>
                  </View>
                )}
                { typeof field.avgwind === 'undefined' && typeof field.precipitation === 'undefined' && (
                  <View style={[styles.selectedElem]}>
                    <View style={styles.selectedImageContainer}>
                      <Image source={require('../../assets/ICN-Hygro.png')} style={styles.selectedImage} />
                    </View>
                    <View style={styles.selectedTextContainer}>
                      <Text style={styles.selectedText}>{i18n.t('intervention_map.avg', { value: `${Math.round(field.avghumi)}%`})}</Text>
                      <Text style={styles.selectedText}>{i18n.t('intervention_map.min', { value: `${Math.round(field.minhumi)}%`})}</Text>
                      <Text style={styles.selectedText}>{i18n.t('intervention_map.max', { value: `${Math.round(field.maxhumi)}%`})}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.carretContainer}>
              <View style={[styles.triangle, { borderBottomColor: field.colorField === COLORS.DEFAULT_FIELD ? COLORS.BAD : field.colorField }]} />
            </View>
          </>
        )}

        <View style={[styles.mapContainer, { top: field != null ? -20 : 0 }]}>
          { intervention.id && (
            <HygoMap intervention={intervention} handleFieldSelection={handleFieldSelection} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
    fontSize: 20
  },  
  phytoDetail: {
    backgroundColor: COLORS.BEIGE,
    display: 'flex',
    paddingTop: 7,
    paddingBottom: 7,
  },
  picker: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingRight: 30
  },  
  pickerIcon: {
    marginLeft: 5,
    fontSize: 20,
    color: COLORS.DARK_BLUE
  },
  phytoDetailRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 42,
    paddingTop: 7,
    paddingBottom: 7
  },
  phytoDetailImage: {
    height: 24,
    width: 24,
    marginRight: 10,
    resizeMode: 'contain'
  },
  phytoDetailText: {
    fontSize: 16,
    fontFamily: 'nunito-regular',
    color: COLORS.DARK_BLUE,
  },
  metrics: {
    backgroundColor: COLORS.BEIGE,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly'
  },
  elem: {
    display: 'flex',
    alignItems: 'center',
    padding: 5,
  },
  elemIcon: {
    height: 24,
    tintColor: '#aaaaaa'
  },
  big: {
    fontFamily: 'nunito-heavy',
    fontSize: 16,
    color: COLORS.DARK_BLUE,
    marginTop: 5,
  },
  mini: {
    fontSize: 12,
    fontFamily: 'nunito-heavy',
    color: '#aaa'
  },
  metricsContainer: {
    backgroundColor: '#fff',
    paddingTop: 22,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 22,
  },
  metricsSurface: {
    fontSize: 14,
    fontFamily: 'nunito-bold',
    color: COLORS.DARK_BLUE,
    marginTop: 21,
    marginLeft: 5
  },
  legend: {

  },
  legendLine: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendText: {
    fontFamily: 'nunito-heavy',
    fontSize: 14,
    color: '#fff',
  },
  selected: {
    paddingTop: 25,
    paddingBottom: 25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
  selectedLine: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  selectedElem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  selectedImageContainer: {
    paddingRight: 20,
  },
  selectedImage: {
    width: 24,
    resizeMode: 'contain',
    tintColor: '#fff'
  },
  selectedText: {
    color: '#fff',
    fontFamily: 'nunito-heavy',
    fontSize: 14,
  },
  carretContainer: {
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    zIndex: 5,
  },
  mapContainer: {
    zIndex: 1,
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

const mapStateToProps = (state) => ({
    token: state.authen.token,
    phytoProductList: state.pulve.phytoProductList,
    interventionValues: state.interv.interventions
});

const mapDispatchToProps = (dispatch, props) => ({
  updateProductsInterv: (products, id) => dispatch(updateProductsInterv(products, id))
})
  
export default connect(mapStateToProps, mapDispatchToProps)(InterventionMapScreen);