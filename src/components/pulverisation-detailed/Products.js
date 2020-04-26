import React from 'react'

import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import { Icon } from 'native-base'

import i18n from 'i18n-js'

import COLORS from '../../colors'

import {connect } from 'react-redux'

const Products = ({ navigation, phytoProductSelected, phytoProductList}) => {
  const openPicker = (screen) => {
    navigation.replace(screen, {
      next: 'Pulverisation',
      back: 'Pulverisation'
    })
  }

  return (
    <TouchableWithoutFeedback onPress={() => openPicker("HygoProductPicker")}>
      <View style={styles.picker}>
        { phytoProductSelected.length === 0 && (
          <Text style={styles.pickerText}>{i18n.t('pulverisation.product_type')}</Text>
        )}
        { phytoProductSelected.length > 0 && (
          <Text style={styles.pickerText}>{ phytoProductList.filter(pp => phytoProductSelected.indexOf(pp.id) > -1).map(pp => pp.name).join(', ') }</Text>
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
  phytoProductList: state.pulve.phytoProductList,
  phytoProductSelected: state.pulve.phytoProductSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Products);