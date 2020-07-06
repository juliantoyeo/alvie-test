import React, { memo } from 'react'

import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { Icon } from 'native-base'

import i18n from 'i18n-js'

import COLORS from '../../colors'

const HygoButton = ({ navigation, action }) => {
  const onPress = () => {
    action && action()
    navigation.navigate('RealTime')
  }
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Icon type='AntDesign' name='arrowright' style={styles.buttonIcon} />
        <Text style={styles.buttonText}>{i18n.t('pulverisation.start')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: COLORS.DARK_BLUE,
    padding: 15,
    paddingHorizontal: 40,
    borderRadius: 40,
    flexDirection: 'row',
    display: 'flex',
  },
  buttonIcon: {
    color: '#fff',
    fontSize: 26,
    marginRight: 20
  },
  buttonText: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 18,
    fontFamily: 'nunito-heavy'
  },
})

export default memo(HygoButton)