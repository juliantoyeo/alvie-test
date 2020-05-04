import React, { useCallback } from 'react'

import { StyleSheet, View, Text } from 'react-native'

import i18n from 'i18n-js'

import COLORS from '../../colors'

const MeteoWhiteStatus = ({ parcelles, currentCondition }) => {
  const getTextForWhitePanel = useCallback(() => {
    let conditions = { EXCELLENT: [], GOOD: [], CORRECT: [], BAD: [], FORBIDDEN: [] }

    let pk = Object.keys(parcelles)
    for (let i = 0; i < pk.length; i++) {
      conditions[parcelles[pk[i]].condition].push(i)
    }

    if (currentCondition === 'EXCELLENT' && conditions.EXCELLENT.length === pk.length) {
      return i18n.t(`meteo_overlay.white_${currentCondition}_everywhere`)
    } else if (currentCondition === 'EXCELLENT') {
      return i18n.t(`meteo_overlay.white_${currentCondition}_some`, { 
        value: Math.round(parseFloat(conditions.EXCELLENT.length) / pk.length * 100)
      })
    } else if (currentCondition === 'GOOD' && conditions.GOOD.length === pk.length) {
      return i18n.t(`meteo_overlay.white_${currentCondition}_everywhere`)
    } else if (currentCondition === 'GOOD') {
      return i18n.t(`meteo_overlay.white_${currentCondition}_some`, { 
        value: Math.round(parseFloat(conditions.GOOD.length + conditions.EXCELLENT.length) / pk.length * 100)
      })
    } else if (currentCondition === 'CORRECT' && conditions.CORRECT.length === pk.length) {
      return i18n.t(`meteo_overlay.white_${currentCondition}_everywhere`)
    } else if (currentCondition === 'CORRECT') {
      return i18n.t(`meteo_overlay.white_${currentCondition}_some`, { 
        value: Math.round(parseFloat(conditions.CORRECT.length + conditions.GOOD.length + conditions.EXCELLENT.length) / pk.length * 100)
      })
    } else if (conditions.FORBIDDEN.length + conditions.BAD.length === pk.length) {
      if (conditions.BAD.length !== 0) {
        return i18n.t(`meteo_overlay.white_BAD_everywhere`)
      } else {
        return i18n.t(`meteo_overlay.white_FORBIDDEN_everywhere`)
      }
    } else if (currentCondition === 'BAD' || currentCondition === 'FORBIDDEN') {
      return i18n.t(`meteo_overlay.white_CORRECT_some`, { 
        value: Math.round(parseFloat(conditions.CORRECT.length + conditions.GOOD.length + conditions.EXCELLENT.length) / pk.length * 100)
      })
    }
  }, [parcelles, currentCondition])

  return (
    <View style={styles.whiteContainer}>
      <Text style={styles.whiteText}>{getTextForWhitePanel()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
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
})

export default MeteoWhiteStatus
