import React, { useCallback } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import i18n from 'i18n-js'

import { connect } from 'react-redux'

const ExtraMetrics = ({ currentHourMetrics, phytoProductSelected }) => {
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

  return (
    <View style={styles.metrics}>
      <Text style={styles.metricsText}>{i18n.t(`meteo_overlay.precipitation_${getRFromProduct()}`, { value: currentHourMetrics.precipitation + currentHourMetrics[getRFromProduct()] })}</Text>
      <Text style={styles.metricsText}>{i18n.t(`realtime.gel_${currentHourMetrics.t3 <= -2 ? 'risky' : 'none'}`)}</Text>
      <Text style={styles.metricsText}>{i18n.t(`meteo_overlay.delta_temp`, { value: currentHourMetrics.deltatemp })}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  metrics: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: 15
  },
  metricsText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'nunito-bold'
  }
})

const mapStateToProps = (state) => ({
  phytoProductList: state.pulve.phytoProductList,
  phytoProductSelected: state.pulve.phytoProductSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ExtraMetrics);