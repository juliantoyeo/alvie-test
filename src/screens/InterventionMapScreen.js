import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-navigation';
import { ScrollView, StyleSheet, View, StatusBar, Image, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { Button, Icon, Text, Left, Right, Body, Header, Title } from 'native-base';

import COLORS from '../colors'
import i18n from 'i18n-js'

import HygoMap from '../components/HygoMap'
import { updateIntervention, getInterventionByID, deleteIntervention } from '../api/hygoApi';

import { updateProductsInterv } from '../store/actions/intervActions'

import moment from 'moment-timezone'

const InterventionMapScreen = ({ navigation, phytoProductList, updateProductsInterv }) => {
  let { intervention, byParcelle, data, region } = navigation.getParam('result')
  const [field, setField] = useState(null)

  const isRacinaire = () => {
    if (intervention.products) {
      return phytoProductList.filter(pp => intervention.products.includes(pp.id) && pp.isRacinaire).length > 0
    } else if (intervention.phytoproduct) {
      return intervention.phytoproduct && intervention.phytoproduct.indexOf('acinaire') > -1
    }
    return false
  }

  const getRFromProduct = useCallback(() => {
    if (intervention.products) {
      let p = []
      for (let i = 0; i < intervention.products.length; i++) {
        let productId = intervention.products[i]
        switch(productId) {
          case 1:
          case 7:
            p.push("r6")

          case 11:
            p.push("r3")

          default:
            p.push("r2")
        }
      }

      if (p.includes("r6")) {
        return "r6"
      } else if (p.includes("r3")) {
        return "r3"
      } else {
        return "r2"
      }
    }

    return "r2"
  }, [intervention.products])

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

  const setProducts = async (p) => {
    await updateIntervention(p, intervention.interventionid)
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

  const getAreaPerCondition = () => {
    let conditions = ['EXCELLENT', 'GOOD', 'CORRECT', 'BAD', 'FORBIDDEN']
    let result = {}
    for (let i = 0; i < intervention.fields.length; i++) {
      if (!intervention.fields[i].Parcelle) {
        continue
      }

      let p = byParcelle[intervention.fields[i].parcelleId]
      if (!p) { continue }
      result[p.condition] = (result[p.condition]||0) + intervention.fields[i].Parcelle.area
    }

    let output = [], total = getTotalArea()
    for (let i = 0; i < conditions.length; i++) {
      if (result[conditions[i]]) {
        output.push({
          condition: conditions[i],
          area: (result[conditions[i]] / 10000).toFixed(1),
          percent: Math.round((result[conditions[i]] / 10000) / total * 100)
        })
      }
    }

    return output
  }

  const onDelete = async () => {
      const res = await deleteIntervention(intervention.id);
      (res == 'OK') && navigation.navigate("Intervention")
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
          <Right style={{ flex: 1 }}>
            <Button transparent onPress={onDelete}>
              <Icon name='trash' style={{ color: '#fff' }} />
            </Button>
          </Right>
        </Header>

        <View style={styles.phytoDetail}>
          <View style={styles.phytoDetailRow}>
            <Image style={[styles.phytoDetailImage, { height: 28 }]} source={require('../../assets/phyto.png')} />
            <TouchableWithoutFeedback onPress={() => {
              navigation.navigate("HygoProductPicker", 
                {  
                  source: 'intervention', 
                  set: setProducts, 
                  initial: products,
                  back: 'LoadingScreen',
                  backParams: {
                    next: 'InterventionMapScreen', 
                    params: {
                      id: intervention.id
                    },
                    action: getInterventionByID,
                  },
                  backScreen: 'Intervention'
              }) 
            }}>
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
            { typeof data.minwind !== 'undefined' && (
              <View style={styles.elem}>
                <Image source={require('../../assets/ICN-Wind.png')} style={styles.elemIcon} />
                <Text style={styles.big}>{`${Math.round(data.avgwind)} km/h`}</Text>
                <Text style={styles.mini}>{`min ${Math.round(data.minwind)} km/h`}</Text>
                <Text style={styles.mini}>{`max ${Math.round(data.maxwind)} km/h`}</Text>
              </View>
            )}
            { typeof data.precipitation !== 'undefined' && (
              <View style={styles.elem}>
                <Image source={require('../../assets/ICN-Rain.png')} style={styles.elemIcon} />
                <Text style={styles.big}>{`${Math.round(data.precipitation)} mm`}</Text>
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
            { getAreaPerCondition().map(c => {
              return (
                <View  key={c.condition} style={[styles.legendLine, { backgroundColor: COLORS[c.condition] }]}>
                  <Text style={[styles.legendText, {flex: 2}]}>{i18n.t(`intervention_map.${c.condition.toLowerCase()}`)}</Text>
                  <Text style={[styles.legendText, {flex: 1}]}>{`${c.area} ha`}</Text>
                  <Text style={[styles.legendText, {flex: 1}]}>{`${c.percent}%`}</Text>
                </View>
              )
            })}
          </View>
        )}

        { field !== null && (
          <>
            <View style={[styles.selected, { backgroundColor: byParcelle[field.parcelleId] && byParcelle[field.parcelleId].condition ? COLORS[byParcelle[field.parcelleId].condition] : (field.colorField === COLORS.DEFAULT_FIELD ? COLORS.CYAN : field.colorField) }]}>
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
                { (byParcelle[field.parcelleId] && typeof byParcelle[field.parcelleId].wind !== 'undefined' || typeof field.precipitation !== 'undefined') && (
                  <View style={[styles.selectedElem, { marginTop: 20 }]}>
                    <View style={styles.selectedImageContainer}>
                      <Image source={require('../../assets/ICN-Wind.png')} style={styles.selectedImage} />
                    </View>
                    <View style={styles.selectedTextContainer}>
                      <Text style={styles.selectedText}>{`${byParcelle[field.parcelleId].winddirection} ${byParcelle[field.parcelleId].wind.toFixed(0)} km/h`}</Text>
                      <Text style={styles.selectedText}>{`raf ${byParcelle[field.parcelleId].gust.toFixed(0)} km/h`}</Text>
                    </View>
                  </View>
                )}
                { (byParcelle[field.parcelleId] && typeof byParcelle[field.parcelleId].t3 !== 'undefined') && (
                  <View style={[styles.selectedElem, { marginTop: 20 }]}>
                    <View style={styles.selectedTextContainer}>
                      <Text style={styles.selectedText}>{i18n.t(`realtime.gel_${byParcelle[field.parcelleId].t3 <= -2 ? 'risky' : 'none'}`)}</Text>
                    </View>
                  </View>
                )}
                { isRacinaire() && byParcelle[field.parcelleId] && typeof byParcelle[field.parcelleId].deltatemp !== 'undefined' && (
                  <View style={[styles.selectedElem]}>
                    <View style={styles.selectedTextContainer}>
                      <Text style={styles.selectedText}>{i18n.t(`meteo_overlay.delta_temp`, { value: byParcelle[field.parcelleId].deltatemp })}</Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={[styles.selectedLine]}>
                { byParcelle[field.parcelleId] && typeof byParcelle[field.parcelleId].wind !== 'undefined' && (
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
                { byParcelle[field.parcelleId] && typeof byParcelle[field.parcelleId].precipitation !== 'undefined' && (
                  <View style={[styles.selectedElem]}>
                    <View style={styles.selectedImageContainer}>
                      <Image source={require('../../assets/ICN-Rain.png')} style={styles.selectedImage} />
                    </View>
                    <View style={styles.selectedTextContainer}>
                      <Text style={styles.selectedText}>{i18n.t(`meteo_overlay.precipitation_${getRFromProduct()}`, { value: Math.round(parseFloat(byParcelle[field.parcelleId][getRFromProduct()])) })}</Text>
                    </View>
                  </View>
                )}
                { (!byParcelle[field.parcelleId] || typeof byParcelle[field.parcelleId].wind === 'undefined') && (! byParcelle[field.parcelleId] || typeof field.precipitation === 'undefined') && (
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
                { !isRacinaire() && byParcelle[field.parcelleId] && typeof byParcelle[field.parcelleId].deltatemp !== 'undefined' && (
                  <View style={[styles.selectedElem, { marginTop: 32 }]}>
                    <View style={styles.selectedTextContainer}>
                      <Text style={styles.selectedText}>{i18n.t(`meteo_overlay.delta_temp`, { value: byParcelle[field.parcelleId].deltatemp })}</Text>
                    </View>
                  </View>
                )}
                { isRacinaire() && byParcelle[field.parcelleId] && typeof byParcelle[field.parcelleId].soilhumi !== 'undefined' && (
                  <View style={[styles.selectedElem, { marginTop: 32, marginLeft: 20 }]}>
                    <View style={styles.selectedImageContainer}>
                      <Image source={require('../../assets/sprout.png')} style={styles.selectedImage} />
                    </View>
                    <View style={styles.selectedTextContainer}>
                      <Text style={styles.selectedText}>{i18n.t(`realtime.soil_humi`, { value: byParcelle[field.parcelleId].soilhumi })}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.carretContainer}>
              <View style={[styles.triangle, { borderBottomColor: byParcelle[field.parcelleId] && byParcelle[field.parcelleId].condition ? COLORS[byParcelle[field.parcelleId].condition] : (field.colorField === COLORS.DEFAULT_FIELD ? COLORS.CYAN : field.colorField) }]} />
            </View>
          </>
        )}

        <View style={[styles.mapContainer, { top: field != null ? -20 : 0 }]}>
          { intervention.id && (
            <HygoMap intervention={intervention} byParcelle={byParcelle} handleFieldSelection={handleFieldSelection} />
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