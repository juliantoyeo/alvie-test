import React from 'react'

import { StyleSheet, View, Text, Dimensions } from 'react-native'

import HygoParcelleSlider from './HygoParcelleSlider'

const MeteoSlider = ({ currentHour, setCurrentHour, data }) => {
  return (
    <View>
      <View style={styles.sliderContainer}>
        <HygoParcelleSlider 
          start={currentHour} 
          onHourChange={(i) => setCurrentHour(i) } 
          data={data} 
          width={Dimensions.get('window').width - 30} />
      </View>
      <View style={styles.hoursContainer}>
        <Text style={styles.hours}>00H</Text>
        <Text style={styles.hours}>08H</Text>
        <Text style={styles.hours}>16H</Text>
        <Text style={styles.hours}>24H</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sliderContainer: {
    marginTop: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hoursContainer: { 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15,
    marginBottom: 30 
  },
  hours: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'nunito-heavy'
  },
})

export default MeteoSlider