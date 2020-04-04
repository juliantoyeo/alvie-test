import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import i18n from 'i18n-js'

import COLORS from '../colors'

const HygoMeteoPhyto = ({ product }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.left, { backgroundColor: COLORS[product.condition.raw] }]}></View>
      <View style={styles.right}>
        <Text style={styles.cardTitle}>{product.name}</Text>
        <Text style={styles.cardCondition}>{product.condition.text}</Text>
        <Text style={styles.cardParcelle}>{i18n.t('meteo.parcelle_percent', { percent: product.percent })}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, {backgroundColor: COLORS[product.condition.raw]}]}>
            <Text style={styles.buttonText}>planifier traitement</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, .4)',
    shadowOffset: { width: 0, height: 2},
    shadowColor: '#000000',
    shadowRadius: 2,
    shadowOpacity: .2,
    padding: 0,
    display: 'flex',
    elevation: 2,
    marginBottom: 10,
    flexDirection: 'row'
  },
  left: {
    width: 25
  },
  right: {
    height: 130,
    padding: 15,
    flex: 1,
  },
  cardTitle: {
    textTransform: 'uppercase',
    fontFamily: 'nunito-bold',
    fontSize: 14,
    color: '#444444'
  },
  cardCondition: {
    color: '#444444',
    fontFamily: 'nunito-bold',
    fontSize: 12,
  },
  cardParcelle: {
    fontFamily: 'nunito-bold',
    color: '#444444',
    fontSize: 12,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  button: {
    height: 30,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 15,
    paddingRight: 20,
    paddingLeft: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'nunito-regular',
    textTransform: 'uppercase'
  }
})

export default HygoMeteoPhyto