import React from 'react'

import { StyleSheet, View, Text, Image } from 'react-native'

import { AnimatedCircularProgress } from 'react-native-circular-progress';

const HygoGauge = ({ value, min, max, color, img, unit }) => {
  return (
    <View style={styles.gaugeElement}>
      <AnimatedCircularProgress
        size={90}
        width={8}
        fill={value !== null ? (value - min)/parseFloat(max - min) * 100 : 0}
        rotation={0}
        tintColor={color}
        backgroundColor="#fff">{() => (
          <Image source={img} style={styles.gaugeIcon}/>
        )}</AnimatedCircularProgress>
      { value !== null && (
        <Text style={styles.gaugeText}>{`${value}${unit}`}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  gaugeElement: {
    display: 'flex',
    alignItems: 'center'
  },
  gaugeIcon: { width: 30, height: 60, resizeMode: 'contain', tintColor: '#aaa' },
  gaugeText: {
    marginTop: 10,
    fontFamily: 'nunito-regular',
    fontSize: 24,
    color: '#aaa',
  },
})

export default HygoGauge