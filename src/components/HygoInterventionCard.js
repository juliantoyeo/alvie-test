import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'

import COLORS from '../colors'

import i18n from 'i18n-js'

const HygoInterventionCard = ({ intervention }) => {
  console.log(intervention)

  const getDay = () => {
    let d = new Date(intervention.starttime)
    return `${d.getDate()}/${("0"+(d.getMonth()+1)).slice(-2)}`
  }

  const getStartHour = () => {
    let d = new Date(intervention.starttime)
    return `${d.getHours()}:${("0"+(d.getMinutes())).slice(-2)}`
  }

  const getEndHour = () => {
    let d = new Date(intervention.endtime)
    return `${d.getHours()}:${("0"+(d.getMinutes())).slice(-2)}`
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTopText}>{i18n.t('intervention.header_top', { day: getDay(), start: getStartHour(), end: getEndHour() })}</Text>
          <Text style={styles.headerBottomText}>{i18n.t('intervention.header_bottom', { number: intervention.number_fields })}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.phytoContainer}>
            <Text style={styles.phyto}>{intervention.phytoproduct||"Aucun produit selectionné"}</Text>
          </View>
            <View style={styles.metrics}>
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
    </View>
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
  },
  phyto: {
    fontFamily: 'nunito-regular',
    fontSize: 16,
    color: COLORS.DARK_GREEN
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
    alignItems: 'center',
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

export default HygoInterventionCard