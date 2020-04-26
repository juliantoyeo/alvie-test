import React, { useCallback } from 'react'

import { StyleSheet, View, Text, Dimensions } from 'react-native'

import { PADDED } from '../../constants'

const HourScale = ({ hour }) => {
  const getHour = useCallback((i) => {
    return  `${PADDED[(parseInt(hour) + i) % 24]}H`
  }, [hour])

  const getWidth = useCallback(() => {
    return (Dimensions.get('window').width - 30) / 12
  }, [])

  return (
    <View style={styles.hoursDetailsContainer}>
      <Text style={[styles.hoursDetails, { left: 0 * getWidth()}]}>{getHour(0)}</Text>
      <Text style={[styles.hoursDetails, { left: 6 * getWidth()}]}>{getHour(6)}</Text>
      <Text style={[styles.hoursDetails, { left: 11 * getWidth()}]}>{getHour(11)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  hoursDetailsContainer: {
    flexDirection: 'row',
    display: 'flex',
    marginBottom: 50,
    marginHorizontal: 15
  },
  hoursDetails: {
    fontFamily: 'nunito-bold',
    fontSize: 12,
    color: '#fff',
    position: 'absolute'
  },
})

export default HourScale