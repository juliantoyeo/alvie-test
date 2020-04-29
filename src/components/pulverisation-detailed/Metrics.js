import React from 'react'

import { View, Image, Text, StyleSheet } from 'react-native'

const Metrics = ({ currentHourMetrics, hasRacinaire }) => {
  return (
    <View style={styles.conditionContainer}>
      <View style={styles.conditionItemContainer}>
        <Image source={require('../../../assets/ICN-Wind.png')} style={styles.conditionItemImage} />
        <View>
          <Text style={styles.conditionItemText}>{`${currentHourMetrics.winddirection} ${Math.round(currentHourMetrics.wind)} km/h`}</Text>
          <Text style={styles.conditionItemText}>{`RAF ${Math.round(currentHourMetrics.gust)} km/h`}</Text>
        </View>
      </View>
      <View style={styles.conditionItemContainer}>
        <Image source={require('../../../assets/ICN-Rain.png')} style={styles.conditionItemImage} />
        <Text style={styles.conditionItemText}>{`${Math.round(currentHourMetrics.precipitation)} mm`}</Text>
        <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(currentHourMetrics.probability))}%`}</Text>
      </View>
      <View style={styles.conditionItemContainer}>
        <Image source={require('../../../assets/ICN-Temperature.png')} style={styles.conditionItemImage} />
        <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(currentHourMetrics.mintemp))}°C`}</Text>
        <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(currentHourMetrics.maxtemp))}°C`}</Text>
      </View>
      <View style={styles.conditionItemContainer}>
        <Image source={require('../../../assets/ICN-Hygro.png')} style={styles.conditionItemImage} />
        <Text style={styles.conditionItemText}>{`${Math.round(currentHourMetrics.minhumi)}%`}</Text>
        <Text style={styles.conditionItemText}>{`${Math.round(currentHourMetrics.maxhumi)}%`}</Text>
      </View>
      { hasRacinaire && (
        <View style={styles.conditionItemContainer}>
          <Image source={require('../../../assets/sprout.png')} style={styles.conditionItemImage} />
          <Text style={styles.conditionItemText}>{`${Math.round(currentHourMetrics.minsoilhumi)}%`}</Text>
          <Text style={styles.conditionItemText}>{`${Math.round(currentHourMetrics.maxsoilhumi)}%`}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  conditionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
    paddingTop: 20,
  },
  conditionItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionItemImage: {
    width: 24,
    resizeMode: 'contain',
    tintColor: '#fff',
    marginBottom: 10,
  },
  conditionItemText: {
    fontFamily: 'nunito-bold',
    fontSize: 14,
    color: '#fff',
  },
})

export default Metrics