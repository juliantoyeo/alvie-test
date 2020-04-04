import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import COLORS from '../colors'

const HygoSliderItem = ({ value, i, pointStyle, display }) => {
  return (
    <View style={[ styles.view, pointStyle ]}>
      <View style={[styles.circle, {backgroundColor: value <= i ? COLORS.DARK_BLUE : COLORS.GREY }]} />
      { display && (<Text style={styles.text}>{value}</Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    alignItems: 'center',
    top: 0
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10/2,
  },
  text: {
    fontSize: 14,
    fontFamily: 'nunito-regular',
    color: '#aaaaaa'
  }
});

export default HygoSliderItem