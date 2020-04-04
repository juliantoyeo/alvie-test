import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

import COLORS from '../colors'

const HygoSliderLabel = ({ oneMarkerLeftPosition, oneMarkerValue, oneMarkerPressed }) => {
  return (
    <View style={{ left: oneMarkerLeftPosition - 15, bottom: -20, width: 30 }}>
      <View style={[styles.triangle]} />
      <View style={styles.circle}>
        <Text style={styles.text}>{oneMarkerValue}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: COLORS.DARK_BLUE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: -20,
  },
  triangle: {
    bottom: -30,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.DARK_BLUE,
    transform: [
      {rotate: '180deg'}
    ]
  },
  text: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'nunito-bold'
  }
})

export default HygoSliderLabel