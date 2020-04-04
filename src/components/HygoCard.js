import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Icon } from 'native-base'

import COLORS from '../colors'

const HygoCard = ({ title, validated, content }) => {
  return (
    <View style={styles.container}>
      <View style={{ minHeight: 26, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Text style={[styles.cardTitle, {color: validated ? COLORS.CYAN : COLORS.GREY }]}>{title}</Text>
        { validated && (<Icon name="check" type="AntDesign" style={{ fontSize: 24, color: COLORS.CYAN }} />)}
      </View>
      {content}
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
  cardTitle: {
    textTransform: 'uppercase',
    fontFamily: 'nunito-bold',
    fontSize: 14,
    flex: 1
  }
})

export default HygoCard