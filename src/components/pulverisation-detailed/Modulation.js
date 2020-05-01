import React, { useState, useEffect, useCallback } from 'react'

import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import { Spinner, Icon } from 'native-base'

import COLORS from '../../colors'

import { getModulationValue } from '../../api/hygoApi'

import i18n from 'i18n-js'

import { connect } from 'react-redux'

const Modulation = ({ day, hour, selected, setModulationChanged, modulationChanged, phytoProductSelected, culturesSelected, phytoProductList }) => {
  const [modulationValue, setModulationValue] = useState()
  const [modulationLoading, setModulationLoading] = useState(false)
  const [cSelected, setCSelected] = useState({...selected})

  useEffect(() => {
    updateModulation()
  }, [])

  useEffect(() => {
    if (selected.min !== cSelected.min || selected.max !== cSelected.max) {
      setModulationChanged(true)
    }
    setCSelected(selected)
  }, [selected])

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

  const getPhytoName = (pid) => {
    return i18n.t(`products.${phytoProductList.filter(p => p.id === pid)[0].name}`)
  }

  return (
    <View style={styles.modulation}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>Calcul de la diminution de la dose</Text>
      </View>
      { phytoProductSelected.map(p => {
        return (
          <View style={styles.modulationContainer} key={p}>
            <View style={styles.modulationTextContaier}>
              <View style={styles.modulationBlock}>
                { modulationChanged && modulationLoading && (
                  <Spinner style={styles.modulationSpinner} />
                )}
                { modulationChanged && (!modulationLoading || !modulationValue) && (
                  <TouchableWithoutFeedback onPress={updateModulation}><Icon type="MaterialCommunityIcons" name="refresh" style={styles.modulationRefresh} /></TouchableWithoutFeedback>
                )}
                { !modulationChanged && (
                  <Text style={styles.modulationTextValue}>{`${modulationValue[p]}%`}</Text>
                )}
              </View>
              <Text style={styles.modulationTextInfo}>{getPhytoName(p)}</Text>
            </View>
          </View>
        )
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
    color: '#8bdf8b',
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