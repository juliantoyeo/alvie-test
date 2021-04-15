import * as React from 'react';
import { View } from 'react-native';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { Icon } from 'native-base';

import COLORS from '../../colors'

const HygoButton = ({ label, onPress, icon, enabled }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={!enabled}
      >
      <View style={[styles.inner, {backgroundColor: enabled ? COLORS.DARK_BLUE : '#AFAEAE' }]}>
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
HygoButton.defaultProps= {
  enabled: true,
  icon: undefined
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    height: 40,
    width: Dimensions.get('window').width / 2
  },
  inner: {
    flex: 1,
    display: 'flex',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
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
    fontSize: 14,
    fontFamily: 'nunito-bold',
  }
});

export default HygoButton
