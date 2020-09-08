import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Icon } from 'native-base'
import hygoStyles from '../../styles'
import COLORS from '../../colors'

export const HygoCard = ({ title, children }) => {
  return (
    <View style={[styles.container, {backgroundColor: '#fff'}]}>
      <View style={{ minHeight: 26, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Text style={[hygoStyles.h1, {flex: 1}]}>{title}</Text>
      </View>
      {children}
    </View>
  )
}
HygoCard.defaultProps = {
  title:'',
  style:{}
}

export const HygoCardSmall = ({ title, children, cardStyle }) => {
  return (
    <View style={[styles.container, {backgroundColor: COLORS.BEIGE}, cardStyle]}>
      <View style={{ minHeight: 26, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Text style={[hygoStyles.h1, {flex: 1}]}>{title}</Text>
      </View>
      {children}
    </View>
  )
}
HygoCardSmall.defaultProps = {
  title:'',
  style:{}
}


const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 20,
    shadowOffset: { width: 0, height: 2},
    shadowColor: '#000000',
    shadowRadius: 2,
    shadowOpacity: .2,
    padding: 20,
    display: 'flex',
    elevation: 2,
    marginBottom: 10
  }
})
