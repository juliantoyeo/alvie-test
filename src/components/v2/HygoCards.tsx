import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Icon } from 'native-base'

import COLORS from '../../colors'

export const HygoCard = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <View style={{ minHeight: 26, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Text style={[styles.cardTitle, {color: COLORS.CYAN }]}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

export const HygoCardSmall = ({ title, children }) => {
  return (
    <View style={styles.containerSmall}>
      <View style={{ minHeight: 26, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Text style={[styles.cardTitle, {color: COLORS.CYAN }]}>{title}</Text>
      </View>
      {children}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 2},
    shadowColor: '#000000',
    shadowRadius: 2,
    shadowOpacity: .2,
    padding: 20,
    display: 'flex',
    elevation: 2,
    marginBottom: 10
  },
  containerSmall: {
    borderTopRightRadius: 20,
    backgroundColor: COLORS.BEIGE,
    shadowOffset: { width: 0, height: 2},
    shadowColor: '#000000',
    shadowRadius: 2,
    shadowOpacity: .2,
    padding: 10,
    display: 'flex',
    elevation: 2,
    marginBottom: 10,
    marginRight: 10,
    borderWidth:1,
    borderColor: '#B4B1B1'
  },
  cardTitle: {
    textTransform: 'uppercase',
    fontFamily: 'nunito-bold',
    fontSize: 14,
    flex: 1
  }
})
