import React, { useCallback } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import i18n from 'i18n-js'

import COLORS from '../../colors'

const MeteoMapHeaderSelected = ({ productId, isRacinaire, data, currentCondition }) => {
  const getRFromProduct = useCallback(() => {
    switch(productId) {
      case 1:
      case 7:
        return "r6"

      case 11:
        return "r3"

      default:
        return "r2"
    }
  }, [productId])

  return (
    <>
      <View style={[styles.metricsContainer, { backgroundColor: COLORS[`${data.condition}_CARDS`]}]}>
        <View style={styles.metricsLine}>
          <Text style={[styles.metricsText, { color: currentCondition === 'CORRECT' ? COLORS.DARK_GREEN : '#fff'}]}>{i18n.t('meteo_overlay.hygro', { value: Math.round(parseFloat(data.humi)) })}</Text>
          <Text style={[styles.metricsText, { color: currentCondition === 'CORRECT' ? COLORS.DARK_GREEN : '#fff'}]}>
            {i18n.t('meteo_overlay.precipitation_'+getRFromProduct(), { value: data[getRFromProduct()] })}
          </Text>
          { isRacinaire && (
            <Text style={[styles.metricsText, { color: currentCondition === 'CORRECT' ? COLORS.DARK_GREEN : '#fff'}]}>{""}</Text>
          )}
        </View>
        <View style={styles.metricsLine}>
          <Text style={[styles.metricsText, { color: currentCondition === 'CORRECT' ? COLORS.DARK_GREEN : '#fff'}]}>{i18n.t('meteo_overlay.temp', { value: Math.round(parseFloat(data.temp)) })}</Text>
          <Text style={[styles.metricsText, { color: currentCondition === 'CORRECT' ? COLORS.DARK_GREEN : '#fff'}]}>{`${i18n.t('meteo_overlay.wind')} ${i18n.t('meteo_overlay.wind_speed', { winddir: data.winddirection, value: Math.round(data.wind) })}`}</Text>
          { isRacinaire && (
            <Text style={[styles.metricsText, { color: currentCondition === 'CORRECT' ? COLORS.DARK_GREEN : '#fff'}]}>{`${i18n.t('meteo_overlay.soil')} ${i18n.t('meteo_overlay.soil_humi', { value: Math.round(data.soilhumi) })}`}</Text>
          )}
        </View>
        <View style={[styles.metricsLine, {flex:1}]}>
          <Text style={[styles.metricsText, { color: currentCondition === 'CORRECT' ? COLORS.DARK_GREEN : '#fff'}]}>{i18n.t('meteo_overlay.delta_temp', { value: Math.round(data.deltatemp) })}</Text>
          <Text style={[styles.metricsText, { color: currentCondition === 'CORRECT' ? COLORS.DARK_GREEN : '#fff'}]}>{i18n.t('meteo_overlay.wind_gust', { value: Math.round(data.gust) })}</Text>
          { isRacinaire && (
            <Text style={[styles.metricsText, { color: currentCondition === 'CORRECT' ? COLORS.DARK_GREEN : '#fff'}]}>{i18n.t('meteo_overlay.soil_temp', { value: Math.round(data.soiltemp) })}</Text>
          )}  
          </View>
      </View>
      <View style={styles.carretContainer}>
        <View style={[styles.triangle, { borderBottomColor: COLORS[`${currentCondition}_CARDS`] }]} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
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
    fontSize: 13,
    color: '#fff',
    fontFamily: 'nunito-regular',
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
})

export default MeteoMapHeaderSelected