import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'
import hygoStyles from '../../styles'
import COLORS from '../../colors'

export const HygoCard = ({ title, children }) => {
  return (
    <View style={[styles.container, {backgroundColor: '#fff'}]}>
      
      { !!title && ( 
      <View style={{ minHeight: 26, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Text style={[hygoStyles.h1, {flex: 1}]}>{title}</Text>
      </View> )}
      
      {children}
    </View>
  )
}
HygoCard.defaultProps = {
  title:undefined,
  style:{}
}

export const HygoCardSmall = ({ title, children, cardStyle }) => {
  return (
    <View style={[styles.container, {backgroundColor: COLORS.BEIGE}, cardStyle]}>
      <View style={{ minHeight: 26, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Text style={[hygoStyles.h1, {flex: 1, textTransform:'none'}]}>{title}</Text>
      </View>
      {children}
    </View>
  )
}
HygoCardSmall.defaultProps = {
  title:'',
  style:{}
}


export const HygoCardTransparent = ({title, subtitle, text, buttonText, onPress}) => {

    return (
      <View style={stylesTransparent.container}>
        <View style={[stylesTransparent.left, { backgroundColor: COLORS.CYAN }]}></View>
        <View style={stylesTransparent.right}>
          <Text style={stylesTransparent.cardTitle}>{title}</Text>
          <Text style={stylesTransparent.cardCondition}>{subtitle}</Text>
          <Text style={stylesTransparent.cardParcelle}>{text}</Text>
          <View style={stylesTransparent.buttonContainer}>
            <TouchableOpacity style={[stylesTransparent.button, {backgroundColor: COLORS.CYAN}]} onPress={onPress}>
              <Text style={stylesTransparent.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
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

const stylesTransparent = StyleSheet.create({
    container: {
      borderTopRightRadius: 30,
      backgroundColor: 'rgba(255, 255, 255, .4)',
      shadowOffset: { width: 0, height: 2},
      shadowColor: '#000000',
      shadowRadius: 2,
      shadowOpacity: .2,
      padding: 0,
      display: 'flex',
      elevation: 2,
      marginBottom: 10,
      flexDirection: 'row'
    },
    left: {
      width: 25
    },
    right: {
      height: 130,
      padding: 15,
      flex: 1,
    },
    cardTitle: {
      textTransform: 'uppercase',
      fontFamily: 'nunito-bold',
      fontSize: 14,
      color: '#444444'
    },
    cardCondition: {
      color: '#444444',
      fontFamily: 'nunito-bold',
      fontSize: 12,
    },
    cardParcelle: {
      fontFamily: 'nunito-bold',
      color: '#444444',
      fontSize: 12,
    },
    buttonContainer: {
      display: 'flex',
      alignItems: 'flex-end'
    },
    button: {
      height: 30,
      borderRadius: 15,
      display: 'flex',
      justifyContent: 'center',
      marginTop: 15,
      paddingRight: 20,
      paddingLeft: 20
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontFamily: 'nunito-regular',
      textTransform: 'uppercase'
    }
  })

