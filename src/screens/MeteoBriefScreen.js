import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native'
import { Spinner } from 'native-base'

import HygoMeteoPhyto from '../components/HygoMeteoPhyto'

import i18n from 'i18n-js'
import capitalize from '../utils/capitalize'
import COLORS from '../colors'

import { getMeteo } from '../api/hygoApi'

const MeteoBriefScreen = () => {
  const MONTHS = [
    i18n.t('months.january'),
    i18n.t('months.february'),
    i18n.t('months.march'),
    i18n.t('months.april'),
    i18n.t('months.may'),
    i18n.t('months.june'),
    i18n.t('months.july'),
    i18n.t('months.august'),
    i18n.t('months.september'),
    i18n.t('months.october'),
    i18n.t('months.november'),
    i18n.t('months.december'),
  ]

  const [loading, setLoading] = useState(true)
  const [meteoData, setMeteoData] = useState({})

  useEffect(() => {
    loadMeteo()
  }, [])

  const loadMeteo = async () => {
    setMeteoData(await getMeteo())
    setLoading(false)
  }

  const getDay = () => {
    let now = new Date()
    return `${now.getDate()} ${capitalize(MONTHS[now.getMonth()])}`
  }

  return (
    <View>
      <View style={styles.textContainer}>
        <Text style={styles.date}>{getDay()}</Text>
        <Text style={styles.next_3hours}>{i18n.t('meteo.next_3_hours')}</Text>
      </View>
      <View style={styles.iconContainer}>
        <View style={styles.meteoElement}>
          <Image source={require('../../assets/ICN-Wind.png')} style={styles.image} />
          { loading && (
            <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
          )}
          { !loading && (
            <Text style={styles.iconText}>{`ess ${meteoData.windspeed} ${meteoData.units.windspeed}`}</Text>
          )}
        </View>
        <View style={styles.meteoElement}>
          <Image source={require('../../assets/ICN-Rain.png')} style={styles.image} />
          { loading && (
            <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
          )}
          { !loading && (
          <Text style={styles.iconText}>{`${meteoData.precipitation} ${meteoData.units.precipitation}`}</Text>
          )}
        </View>
        <View style={styles.meteoElement}>
          <Image source={require('../../assets/ICN-Temperature.png')} style={styles.image} />
          { loading && (
            <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
          )}
          { !loading && (
            <Text style={styles.iconText}>{`${meteoData.temperature}${meteoData.units.temperature}`}</Text>
          )}
        </View>
        <View style={styles.meteoElement}>
          <Image source={require('../../assets/ICN-Hygro.png')} style={styles.image} />
          { loading && (
            <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
          )}
          { !loading && (
            <Text style={styles.iconText}>{`${meteoData.humidity}${meteoData.units.humidity}`}</Text>
          )}
        </View>
      </View>
      <ScrollView style={styles.productList}>
        { loading && (
          <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
        )}

        { !loading && meteoData.products.map(p => {
            return (
              <HygoMeteoPhyto key={p.id} product={p} />
            )
        })}
        <View style={{ height: 200 }}></View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  date: {
    fontFamily: 'nunito-bold',
    fontSize: 32,
    color: '#fff'
  },
  next_3hours: {
    fontFamily: 'nunito-regular',
    fontSize: 18,
    color: '#fff'
  },
  textContainer: {
    display: 'flex', 
    alignItems: 'center',
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 15
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: 45,
    paddingRight: 45,
    paddingTop: 15,
    flexDirection: 'row',
  },
  iconText: {
    fontFamily: 'nunito-bold',
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10
  },
  meteoElement: {
    display: 'flex',
    alignItems: 'center',
  },
  productList: {
    paddingRight: 15,
    marginTop: 15,
  }
})

export default MeteoBriefScreen