import React from 'react'
import { StyleSheet, Image, View, Text } from 'react-native'

const MeteoMetrics = ({ data, currentProduct }) => {
  return (
    <View style={styles.conditionContainer}>
      <View style={styles.conditionItemContainer}>
        <Image source={require('../../../assets/ICN-Wind.png')} style={styles.conditionItemImage} />
        <Text style={styles.conditionItemText}>{`${data.winddirection} ${Math.round(data.wind)} km/h`}</Text>
        <Text style={styles.conditionItemText}>{`RAF ${Math.round(data.gust)} km/h`}</Text>
      </View>
      <View style={styles.conditionItemContainer}>
        <Image source={require('../../../assets/ICN-Rain.png')} style={styles.conditionItemImage} />
        <Text style={styles.conditionItemText}>{`${data.precipitation} mm`}</Text>
        <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(data.probability))}%`}</Text>
      </View>
      <View style={styles.conditionItemContainer}>
        <Image source={require('../../../assets/ICN-Temperature.png')} style={styles.conditionItemImage} />
        <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(data.mintemp))}°C`}</Text>
        <Text style={styles.conditionItemText}>{`${Math.round(parseFloat(data.maxtemp))}°C`}</Text>
      </View>
      <View style={styles.conditionItemContainer}>
        <Image source={require('../../../assets/ICN-Hygro.png')} style={styles.conditionItemImage} />
        <Text style={styles.conditionItemText}>{`${data.minhumi}%`}</Text>
        <Text style={styles.conditionItemText}>{`${data.maxhumi}%`}</Text>
      </View>
      { currentProduct.isRacinaire && (
        <View style={styles.conditionItemContainer}>
          <Image source={require('../../../assets/sprout.png')} style={styles.conditionItemImage} />
          <Text style={styles.conditionItemText}>{`${Math.round(data.soilhumi)}%`}</Text>
          <Text style={styles.conditionItemText}>{`${Math.round(data.soiltemp)}°C`}</Text>
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

export default MeteoMetrics