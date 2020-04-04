import * as React from 'react';
import { View } from 'react-native';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { Icon } from 'native-base';

import COLORS from '../colors'

const HygoButton = ({ label, onPress, icon }) => {
  return (
    <TouchableOpacity transparent 
      style={styles.button}
      onPress={onPress}>
      <View style={styles.inner}>
        <View style={styles.content}>
          { icon && (
            <Icon type={icon.type} name={icon.name} style={[styles.icon, {...{fontSize: icon.fontSize || 32}}]} />
          )}
          <Text style={styles.text}>{label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({    
  button: { 
    display: 'flex', 
    height: 60, 
    width: Dimensions.get('window').width 
  },
  inner: {
    flex: 1,
    display: 'flex',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.DARK_BLUE,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  content: { 
    display: 'flex', 
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    fontSize: 32, 
    color: '#fff'
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'nunito-bold',
  }
});

export default HygoButton