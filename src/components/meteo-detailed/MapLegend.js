import React, { memo } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import i18n from 'i18n-js'

import COLORS from '../../colors'

const MapLegend = () => {
  return (
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
  )
}

const styles = StyleSheet.create({
  legendContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 15,
    top: -20
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
})

export default memo(MapLegend)