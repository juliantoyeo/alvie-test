import React from 'react'
import { StyleSheet } from 'react-native'
import { Header, Body, Title } from 'native-base'

import COLORS from '../colors'

const HeaderMeteo = ({ text }) => {
  return (
    <Header style={styles.header} androidStatusBarColor="transparent">
      <Body style={styles.body}>
        <Title style={styles.headerTitle}>{text}</Title>
      </Body>
    </Header>
  )
}

const styles = StyleSheet.create({    
  header: {
    fontFamily: 'nunito-regular',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: COLORS.DARK_GREEN,
    fontSize: 24,
    fontFamily: 'nunito-bold',
  },
  body: { 
  }
});

export default HeaderMeteo