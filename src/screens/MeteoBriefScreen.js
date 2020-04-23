import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native'
import { Spinner } from 'native-base'

import HygoMeteoPhyto from '../components/HygoMeteoPhyto'

import i18n from 'i18n-js'
import capitalize from '../utils/capitalize'
import COLORS from '../colors'

import { getMeteo } from '../api/hygoApi'

const MeteoBriefScreen = ({ navigation }) => {
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
    let meteo = await getMeteo()

    setMeteoData(meteo)
    setLoading(false)
  }

  const getDay = () => {
    let now = new Date()
    return `${now.getDate()} ${capitalize(MONTHS[now.getMonth()])}`
  }

  return (
    <ScrollView>
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
            <>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.wind)} km/h`}</Text>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.gust)} km/h`}</Text>
            </>
          )}
        </View>
        <View style={styles.meteoElement}>
          <Image source={require('../../assets/ICN-Rain.png')} style={styles.image} />
          { loading && (
            <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
          )}
          { !loading && (
            <>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.precipitation)} mm`}</Text>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.probability)}%`}</Text>
            </>
          )}
        </View>
        <View style={styles.meteoElement}>
          <Image source={require('../../assets/ICN-Temperature.png')} style={styles.image} />
          { loading && (
            <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
          )}
          { !loading && (
            <>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.mintemp)}°C`}</Text>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.maxtemp)}°C`}</Text>
            </>
          )}
        </View>
        <View style={styles.meteoElement}>
          <Image source={require('../../assets/ICN-Hygro.png')} style={styles.image} />
          { loading && (
            <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
          )}
          { !loading && (
            <>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.minhumi)}%`}</Text>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.maxhumi)}%`}</Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.productList}>
        { loading && (
          <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
        )}

        { !loading && meteoData.products.map(p => {
            return (
              <HygoMeteoPhyto key={p.id} product={p} navigation={navigation} />
            )
        })}
        <View style={{ height: 80 }}></View>
      </View>
    </ScrollView>
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
  },
  meteoElement: {
    display: 'flex',
    alignItems: 'center',
  },
  productList: {
    paddingRight: 15,
    marginTop: 15,
  },
  image: {
    marginBottom: 10,
  }
})

export default MeteoBriefScreen