import React, { useState, useEffect } from 'react'

import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import { Spinner, Icon } from 'native-base'

import COLORS from '../../colors'

import { getModulationValue } from '../../api/hygoApi'

import i18n from 'i18n-js'

import { connect } from 'react-redux'

const Modulation = ({ day, hour, selected, setModulationChanged, modulationChanged, phytoProductSelected, culturesSelected }) => {
  const [modulationValue, setModulationValue] = useState()
  const [modulationLoading, setModulationLoading] = useState(false)
  const [cSelected, setCSelected] = useState({...selected})

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

    setModulationValue(res.value)

    setModulationChanged(false)
    setModulationLoading(false)
  }

  return (
    <View style={styles.modulation}>
      <View style={styles.modulationContainer}>
        <View style={styles.modulationTextContaier}>
          <Text style={styles.modulationTextInfo}>{i18n.t('pulverisation.reduce_dosage')}</Text>
          <View style={styles.modulationBlock}>
            { modulationChanged && modulationLoading && (
                <Spinner style={styles.modulationSpinner} />
            )}
            { modulationChanged && !modulationLoading && (
                <TouchableWithoutFeedback onPress={updateModulation}><Icon type="MaterialCommunityIcons" name="refresh" style={styles.modulationRefresh} /></TouchableWithoutFeedback>
            )}
            { !modulationChanged && (
              <Text style={styles.modulationTextValue}>{`${modulationValue}%`}</Text>
            )}
          </View>
        </View>
        <Text style={styles.modulationTextStar}>{i18n.t('pulverisation.computation_hint')}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modulation: {
    backgroundColor: COLORS.BEIGE,
    paddingRight: 15,
  },
  modulationContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 15,
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
    fontSize: 16
  },
  modulationBlock: {
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modulationTextValue: {
    marginLeft: 27,
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
  culturesSelected: state.pulve.culturesSelected,
  phytoProductSelected: state.pulve.phytoProductSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Modulation);