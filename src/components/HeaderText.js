import React from 'react'
import { StyleSheet } from 'react-native'
import { Header, Body, Title, Left, Right } from 'native-base'

import COLORS from '../colors'

const HeaderText = ({ text }) => {
  return (
    <Header style={styles.header} androidStatusBarColor={COLORS.CYAN}>
      <Body style={styles.body}>
        <Title style={styles.headerTitle}>{text}</Title>
      </Body>
    </Header>
  )
}

const styles = StyleSheet.create({    
  header: {
    fontFamily: 'nunito-regular',
    backgroundColor: COLORS.CYAN,
  },
  headerTitle: {
    color: COLORS.DARK_GREEN,
    fontSize: 24,
    fontFamily: 'nunito-bold',
  },
  body: { 
  }
});

export default HeaderText