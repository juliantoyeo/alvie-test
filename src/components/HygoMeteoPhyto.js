import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import i18n from 'i18n-js'

import COLORS from '../colors'

import { updateUIPhytoProduct, updateUICultures, getMeteoIntervention } from '../api/hygoApi'

import { connect } from 'react-redux'
import { updatePhytoProductSelected, updateCulturesSelected } from '../store/actions/pulveActions'

const HygoMeteoPhyto = ({ product, navigation, updatePhytoProductSelected, day, hour, cultures, phytoProductSelected, culturesSelected, updateCulturesSelected }) => {
  const handleProductClick = async () => {
    updateUIPhytoProduct([ product.id ])
    updateUICultures(cultures.map(c => c.id))

    await updatePhytoProductSelected([ product.id ])
    await updateCulturesSelected(cultures.map(c => c.id))

    navigation.navigate('LoadingScreen', {
      next: 'NextPulverisationDetails',
      params: {
        phytoProductSelected: [ product.id ], 
        culturesSelected: cultures.map(c => c.id), 
        day, 
        hour,
      },
      raw: true,
      action: async ({ phytoProductSelected, culturesSelected, day, hour }) => {
        let data = await getMeteoIntervention({
          products: phytoProductSelected,
          cultures: culturesSelected
        })

        return {
          day,
          hour,
          data,
          r: 2,
        }
      }
    })
  }

  return (
    <View style={styles.container}>
      <View style={[styles.left, { backgroundColor: COLORS[product.condition] }]}></View>
      <View style={styles.right}>
        <Text style={styles.cardTitle}>{product.name}</Text>
        <Text style={styles.cardCondition}>{i18n.t(`meteo.condition_${product.condition}`)}</Text>
        <Text style={styles.cardParcelle}>{i18n.t('meteo.parcelle_percent', { percent: Math.round(100*product.treatable_percent) })}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, {backgroundColor: COLORS[product.condition]}]} onPress={handleProductClick}>
            <Text style={styles.buttonText}>{i18n.t('meteo.plan')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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

const mapStateToProps = (state) => ({
  cultures: state.metadata.cultures,
  culturesSelected: state.pulve.culturesSelected,
  phytoProductSelected: state.pulve.phytoProductSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
  updatePhytoProductSelected: (selected) => dispatch(updatePhytoProductSelected(selected)),
  updateCulturesSelected: (selected) => dispatch(updateCulturesSelected(selected)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HygoMeteoPhyto);