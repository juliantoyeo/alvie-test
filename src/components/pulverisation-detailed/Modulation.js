import React, { useState, useEffect, useCallback } from 'react'

import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import { Spinner, Icon } from 'native-base'

import COLORS from '../../colors'

import { getModulationValue } from '../../api/hygoApi'

import i18n from 'i18n-js'

import { connect } from 'react-redux'

const phytoIdHide = [12]     // Hide "solution azotée"

const Modulation = ({ day, hour, selected, setModulationChanged, modulationChanged, phytoProductSelected, culturesSelected, phytoProductList }) => {
  /**
   * cSelected    : number of slot selected. {min: <number>, max: <number>}
   */
  const [modulationValue, setModulationValue] = useState()
  const [modulationLoading, setModulationLoading] = useState(false)
  const [cSelected, setCSelected] = useState({...selected})

  const updateModulation = async () => {
    setModulationLoading(true)

    let params = {
      products: phytoProductSelected,
      cultures: culturesSelected,
      selected: cSelected,
    }

    let res = await getModulationValue({
      ...params,
      day,
      hour,
    })

    setModulationValue(res)

    setModulationChanged(false)
    setModulationLoading(false)
  }

  useEffect(() => {
    updateModulation()
  }, [])

  useEffect(() => {
    if (selected.min !== cSelected.min || selected.max !== cSelected.max) {
      setModulationChanged(true)
    }
    setCSelected(selected)
  }, [selected])

  const getPhytoName = (pid) => {
    return i18n.t(`products.${phytoProductList.filter(p => p.id === pid)[0].name}`)
  }

  return ( 
    // Hide the whole component if all the products have to be hidden
    // phytoProductSelected.reduce((acc, p) => phytoIdHide.find((id) => id == p)  ? acc+1 : acc , 0) < phytoProductSelected.length && (
    <View style={styles.modulation}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>{i18n.t('modulation.dose_computation')}</Text>
      </View>
      { phytoProductSelected.map(p => {
        return (
          // Hide the product if necessary
          !phytoIdHide.find((id) => id == p) && (
          <View style={styles.modulationContainer} key={p}>
            <View style={styles.modulationTextContaier}>
              <View style={styles.modulationBlock}>
                { modulationChanged && modulationLoading && (
                  <Spinner style={styles.modulationSpinner} />
                )}
                { (modulationChanged || !modulationValue) && !modulationLoading && (
                  <TouchableWithoutFeedback onPress={updateModulation}><Icon type="MaterialCommunityIcons" name="refresh" style={styles.modulationRefresh} /></TouchableWithoutFeedback>
                )}
                { !modulationChanged && (
                  <Text style={styles.modulationTextValue}>{`${modulationValue[p]}%`}</Text>
                )}
              </View>
              <Text style={styles.modulationTextInfo}>{getPhytoName(p)}</Text>
            </View>
          </View>
        ))
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  modulation: {
    backgroundColor: COLORS.BEIGE,
    paddingRight: 15,
    paddingBottom: 10,
  },
  headerView: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  headerText: {
    fontFamily: 'nunito-bold',
    fontSize: 16,
    color: COLORS.DARK_BLUE,
  },
  modulationContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingBottom: 12,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  modulationTextContaier: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modulationTextInfo: {
    color: COLORS.DARK_BLUE,
    fontFamily: 'nunito-bold',
    fontSize: 16,
    flex: 1,
  },
  modulationBlock: {
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  modulationTextValue: {
    marginLeft: 0,
    color: COLORS.DARK_BLUE,
    fontFamily: 'nunito-bold',
    fontSize: 48,
  },
  modulationRefresh: {
    marginLeft: 27,
    color: '#8bdf8b',
    fontSize: 48,
  },
  modulationTextStar: {
    fontSize: 12,
    fontFamily: 'nunito-heavy',
    color: '#aaaaaa',
    marginBottom: 30,
  },
})

const mapStateToProps = (state) => ({
  phytoProductList: state.pulve.phytoProductList,
  culturesSelected: state.pulve.culturesSelected,
  phytoProductSelected: state.pulve.phytoProductSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Modulation);