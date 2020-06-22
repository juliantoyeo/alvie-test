import React from 'react'

import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import { Icon } from 'native-base'

import i18n from 'i18n-js'

import COLORS from '../../colors'

import {connect } from 'react-redux'

const Cultures = ({ navigation, cultures, culturesSelected }) => {
  const openPicker = (screen) => {
    navigation.replace(screen)
  }

  return (
    <TouchableWithoutFeedback onPress={() => openPicker("HygoCulturePicker")}>
      <View style={styles.picker}>
      { culturesSelected.length === 0 && (
        <Text style={styles.pickerText}>{i18n.t('pulverisation.culture_type')}</Text>
      )}
      { culturesSelected.length === cultures.length && (
        <Text style={styles.pickerText}>{i18n.t('pulverisation.all_cultures')}</Text>
      )}
      { culturesSelected.length < cultures.length && culturesSelected.length > 0 && (
        <Text style={styles.pickerText}>{ cultures.filter(pp => culturesSelected.indexOf(pp.id) > -1).map(pp => i18n.t(`cultures.${pp.name}`)).join(', ') }</Text>
      )}
      <Icon style={styles.pickerIcon} type="Feather" name="chevron-down" />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  picker: {
    shadowColor: '#000',
    shadowOpacity: .2,
    shadowOffset: {
      width: 0,
      height: 3
    },
    elevation: 3,
    backgroundColor: '#fff',
    paddingLeft: 20,
    borderTopRightRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 20,
    paddingVertical: 10,
  },
  pickerText: {
    flex: 1,
    color: COLORS.DARK_GREEN,
    fontSize: 16,
    fontFamily: 'nunito-bold',
  },
  pickerIcon: {
    marginLeft: 5,
    fontSize: 20,
    color: COLORS.DARK_GREEN
  },
})

const mapStateToProps = (state) => ({
  cultures: state.metadata.cultures,
  culturesSelected: state.pulve.culturesSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Cultures);