import React, { useCallback } from 'react'

import { StyleSheet, View, Text } from 'react-native'

import i18n from 'i18n-js'

import { connect } from 'react-redux'

import COLORS from '../../colors'

const ConditionHeader = ({ isRefreshing, history, phytoProductList, phytoProductSelected, currentMeteo, currentCondition }) => {
  const getRFromProduct = useCallback(() => {
    let p = []
    for (let i = 0; i < phytoProductSelected.length; i++) {
      let productId = phytoProductSelected[i]
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
  }, [phytoProductSelected])

  const hasRacinaire = useCallback(() => {
    return phytoProductList.filter(p => phytoProductSelected.includes(p.id)).filter(p => p.isRacinaire).length > 0
  }, [phytoProductSelected])

  return (
    <View >
      { isRefreshing && (
        <View style={[styles.headerCondition, { backgroundColor:  COLORS.CYAN }]}>
          <Text style={styles.textCondition}>{}</Text>
        </View>
      )}
      { !isRefreshing && history.length === 0 && (
        <View style={[styles.headerCondition, { backgroundColor:  COLORS.CYAN }]}>
          <Text style={styles.textCondition}>{i18n.t('realtime.waiting_for_data')}</Text>
        </View>
      )}

      { !isRefreshing && history.length > 0 && phytoProductSelected.length === 0 && !currentMeteo.timestamp && (
        <View style={[styles.headerCondition, { backgroundColor:  COLORS.CYAN }]}>
          <Text style={styles.textCondition}>{i18n.t('realtime.no_product')}</Text>
          <Text style={styles.textCondition}>{i18n.t('realtime.no_parcelle')}</Text>
        </View>
      )}
      { !isRefreshing && history.length > 0 && phytoProductSelected.length === 0 && currentMeteo.timestamp && (
        <View style={[styles.headerCondition, { backgroundColor:  COLORS.CYAN }]}>
          <Text style={styles.textCondition}>{i18n.t('realtime.no_product')}</Text>
          <Text style={styles.textCondition}>{""}</Text>
        </View>
      )}
      { !isRefreshing && history.length > 0 && phytoProductSelected.length > 0 && !currentMeteo.timestamp && (
        <View style={[styles.headerCondition, { backgroundColor:  COLORS.CYAN }]}>
          <Text style={styles.textCondition}>{i18n.t('realtime.no_parcelle')}</Text>
          <Text style={styles.textCondition}>{""}</Text>
        </View>
      )}
      { !isRefreshing && history.length > 0 && phytoProductSelected.length > 0 && currentMeteo.timestamp && (
        <View style={[styles.headerCondition, { backgroundColor: COLORS[`${currentCondition.condition}_GRADIENT_BOT`], alignItems: 'center', justifyContent: 'center', height: 90 }]}>
          <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text style={styles.textCondition}>{i18n.t(`realtime.status_conditions_${currentCondition.condition}`)}</Text>
          </View>
          <View style={styles.metrics}>
            <View style={styles.metricsColumn}>
              <Text style={styles.metricsText}>{i18n.t(`meteo_overlay.precipitation_${getRFromProduct()}`, { value: Math.round(parseFloat(currentCondition[getRFromProduct()])) })}</Text>
              <Text style={styles.metricsText}>{i18n.t(`realtime.gel_${currentCondition.t3 <= -2 ? 'risky' : 'none'}`)}</Text>
            </View>
            <View style={styles.metricsColumn}>
              <Text style={styles.metricsText}>{i18n.t(`meteo_overlay.delta_temp`, { value: Math.round(parseFloat(currentCondition.dt)) })}</Text>
              <Text style={styles.metricsText}>{hasRacinaire() ? i18n.t(`realtime.soil_humi`, { value: Math.round(parseFloat(currentCondition.hs)) } ) : ''}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  metrics: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  metricsColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1
  },
  metricsText: {
    fontFamily: 'nunito-regular',
    color: '#fff',
    fontSize: 14,
  },
  headerCondition: {
    padding: 15,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.EXCELLENT,
    display: 'flex',
    borderWidth: 0,
    borderRadius: 0,
    borderColor: COLORS.BEIGE, //'#888',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  textCondition: {
    textTransform: 'uppercase',
    color: '#fff',
    fontFamily: 'nunito-heavy',
    fontSize: 14,
    padding: 2,
  },
})

const mapStateToProps = (state) => ({
  phytoProductList: state.pulve.phytoProductList,
  phytoProductSelected: state.pulve.phytoProductSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ConditionHeader);