import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Icon } from 'native-base'

import i18n from 'i18n-js'

const MeteoMapHeader = ({ currentCondition }) => {
  return (
    <View style={styles.mapHeader}>
      <Icon type="MaterialIcons" name="info-outline" style={styles.mapHeaderIcon} />
      <Text style={styles.mapHeaderText}>{i18n.t('meteo_overlay.map_header', { value: i18n.t(`intervention_map.${currentCondition.toLowerCase()}`)})}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  mapHeader: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 30,
    paddingRight: 30,
    paddingLeft: 15,
    paddingBottom: 50,
  },
  mapHeaderIcon: {
    color: '#fff',
    fontSize: 26,
    marginRight: 10,
  },
  mapHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'nunito-bold',
    flex: 1,
  },
})

export default MeteoMapHeader