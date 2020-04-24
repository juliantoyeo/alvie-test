import React, { useState } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native'

import COLORS from '../colors'

import _ from 'lodash';

const NUM_ITEMS = 12

const conditionsOrdering = ['FORBIDDEN', 'BAD', 'CORRECT', 'GOOD', 'EXCELLENT']

const HygoParcelleIntervention = ({ from, data, width, onHourChange, initialMax }) => {
  const [selected, setSelected] = useState({
    min: parseInt(0),
    max: parseInt(initialMax?initialMax:0)
  })

  const getColor = (i) => {
    let isSelected = i <= selected.max && selected.min <= i
    if (isSelected) 
      return 'transparent'

    let padded = `${i+from}`.padStart(2, '0')
    return COLORS[`${data[padded].condition}_CARDS`];
  }
  
  const getItemWidth = (i, isSub) => {
    const w = width, margin = parseFloat(w) / NUM_ITEMS * 0.14, isSelected = i <= selected.max && selected.min <= i
    if (isSub) {
      return {
        borderWidth: isSelected ? margin : 0,
        borderColor: isSelected ? 'transparent' : '#fff',
        height: 45 + (isSelected ? margin : 0),
      }
    }

    return {
      width: parseFloat(w) / NUM_ITEMS,
      paddingHorizontal: isSelected ? 0 : margin,
      paddingVertical: 5,
      height: 55 + (isSelected ? margin : 0),
    }
  }

  const getSelectedWidth = () => {
    if (selected.max < selected.min) {
      return {
        width: 0,
        boderWidth: 0,
      }
    }

    let curCond = null
    for (let i = selected.min; i <= selected.max; i++) {
      let padded = `${i+from}`.padStart(2, '0')
      if (!curCond || conditionsOrdering.indexOf(curCond) >= conditionsOrdering.indexOf(data[padded].condition)) {
        curCond = data[padded].condition
      }
    }

    const w = width, margin = parseFloat(w) / NUM_ITEMS * 0.14
    return {
      width: (selected.max-selected.min+1) * (parseFloat(w) / NUM_ITEMS),
      marginHorizontal: 0,
      borderWidth: margin,
      borderColor: '#fff',
      height: 45 + margin,
      position: 'absolute',
      left: selected.min * width / NUM_ITEMS,
      backgroundColor: COLORS[`${curCond}_CARDS`],
    }
  }

  const getContainerHeight = () => {
    const w = width, margin = parseFloat(w) / NUM_ITEMS * 0.14
    return 45 + margin
  }

  const computeSelected = (prev, idx) => {
    let i = idx, isSelected = i <= prev.max && prev.min <= i

    if (isSelected) {
      if (i !== prev.max && i !== prev.min) {
        return { ...prev }
      }

      return {
        min: i === prev.min ? i + 1 : prev.min,
        max: i === prev.max ? i - 1 : prev.max,
      }
    } 

    if (prev.max < prev.min) {
      return {
        min: i,
        max: i
      }
    }

    if (i > prev.max + 1 || i < prev.min - 1) {
      return { ...prev }
    }

    return {
      min: Math.min(i, prev.min),
      max: Math.max(i, prev.max),
    }
  }

  const onPressParcelle = (idx) => {
    let newselected = computeSelected(selected, idx)
    
    setSelected(newselected)
    onHourChange(newselected)
  }

  return (
    <View style={[ styles.container, { width: width, height: getContainerHeight() }]}>
      <View style={[styles.selected, {
        ...getSelectedWidth()
      }]}></View>
      { [...Array(NUM_ITEMS).keys()].map(i => {
        return (
          <TouchableWithoutFeedback key={i} onPress={() => onPressParcelle(i)}>
            <View style={[styles.parcelle, {
              ...getItemWidth(i)}, 
            ]}>
              <View style={[styles.subTile, { backgroundColor: getColor(i), }]}></View>
            </View>
          </TouchableWithoutFeedback>
        )
      }) }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  parcelle: {
    height: 45,
    zIndex: 5,
  },
  subTile: {
    height: 45,
    zIndex: 5
  },
  selected: {
    height: 45,
    zIndex: 1,
  }
})

export default HygoParcelleIntervention