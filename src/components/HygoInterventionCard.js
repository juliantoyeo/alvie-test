import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'

import COLORS from '../colors'

import i18n from 'i18n-js'

import { connect } from 'react-redux'

import moment from 'moment-timezone'

const HygoInterventionCard = ({ navigation, intervention, phytoProductList }) => {
  const getDay = () => {
    return moment.utc(intervention.starttime).tz('Europe/Paris').format('DD/MM')
  }

  const getStartHour = () => {
    return moment.utc(intervention.starttime).tz('Europe/Paris').format('HH:mm')
  }

  const getEndHour = () => {
    return moment.utc(intervention.endtime).tz('Europe/Paris').format('HH:mm')
  }

  const onCardPressed = () => {
    navigation.navigate('InterventionMapScreen', {
      intervention
    })
  }

  const getPhyto = () => {
    if (intervention.products && intervention.products.length > 0) {
      let ptext = []
      if (intervention.products.indexOf(-1) > -1) {
        ptext.push(i18n.t('intervention_map.other_farm_work'))
      }

      ptext = ptext.concat(phytoProductList.filter(pp => intervention.products.includes(pp.id)).map(p => i18n.t(`products.${p.name}`)))
      return ptext.join(', ')
    } else if (intervention.phytoproduct) {
      return intervention.phytoproduct
    }

    return i18n.t('intervention.no_phyto_selected')
  }

  return (
    <TouchableOpacity onPress={onCardPressed} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTopText}>{i18n.t('intervention.header_top', { day: getDay(), start: getStartHour(), end: getEndHour() })}</Text>
          <Text style={styles.headerBottomText}>{i18n.t('intervention.header_bottom', { number: intervention.numberFields })}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.phytoContainer}>
            <Image source={require('../../assets/phyto.png')} style={styles.elemIcon} />
            <Text style={styles.phyto}>{getPhyto()}</Text>
          </View>
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
              <Text style={styles.mini}>{`min ${intervention.mintemp.toFixed(1)}°C`}</Text>
              <Text style={styles.mini}>{`max ${intervention.maxtemp.toFixed(1)}°C`}</Text>
            </View>
            <View style={styles.elem}>
              <Image source={require('../../assets/ICN-Hygro.png')} style={styles.elemIcon} />
              <Text style={styles.big}>{`${Math.round(intervention.avghumi)}%`}</Text>
              <Text style={styles.mini}>{`min ${Math.round(intervention.minhumi)}%`}</Text>
              <Text style={styles.mini}>{`max ${Math.round(intervention.maxhumi)}%`}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,

  },
  content: {
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: .6,
    shadowRadius: 3,
    shadowColor: '#000',
    elevation: 4,
    backgroundColor: '#fff',
    padding: 15
  },
  header: {
    backgroundColor: COLORS.DARK_BLUE,
    borderTopRightRadius: 20,
    display: 'flex',
    padding: 15
  },
  headerTopText: {
    textTransform: 'uppercase',
    fontFamily: 'nunito-regular',
    fontSize: 14,
    color: '#fff',
  },
  headerBottomText: {
    fontFamily: 'nunito-regular',
    fontSize: 14,
    color: '#fff',
  },
  phytoContainer: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 5,
    paddingRight: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  phyto: {
    fontFamily: 'nunito-regular',
    fontSize: 16,
    color: COLORS.DARK_GREEN,
    marginLeft: 10
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
    fontFamily: 'nunito-bold',
    fontSize: 16,
    color: COLORS.DARK_BLUE,
    marginTop: 5,
  },
  mini: {
    fontSize: 12,
    fontFamily: 'nunito-heavy',
    color: '#aaa'
  }
})

const mapStateToProps = (state) => ({
  phytoProductList: state.pulve.phytoProductList,
});

const mapDispatchToProps = (dispatch, props) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(HygoInterventionCard);