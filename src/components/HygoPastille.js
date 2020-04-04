import React from 'react'
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { Icon } from 'native-base'

import COLORS from '../colors'

const HygoPastille = ({ color, colorText, style, checked, dark, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.pastille, style]}>
        <View style={[styles.pastilleCircle, { backgroundColor: color }]}>
          { checked && (
            <Icon type="AntDesign" name="check" style={[styles.icon, { color: !dark ? '#fff' : COLORS.DARK_GREEN }]} />
          )}
        </View>
        <Text style={styles.text}>{colorText}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  pastille: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
  },
  pastilleCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowRadius: 3,
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowOpacity: .2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  text: {
    fontSize: 12,
    fontFamily: 'nunito-bold',
    color: COLORS.DARK_GREEN
  },
  icon: {
    fontSize: 20
  }
})

export default HygoPastille