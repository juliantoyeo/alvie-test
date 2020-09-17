import React, { useState, Component } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, PanResponder, Dimensions } from 'react-native'

import COLORS from '../../colors'

import _ from 'lodash';

const NUM_ITEMS = 24
const CURSOR_HEIGHT = 120

const conditionsOrdering = ['FORBIDDEN', 'BAD', 'CORRECT', 'GOOD', 'EXCELLENT']

class HygoParcelleIntervention extends Component { 
  constructor(props) {
    super(props);

    this.onHourChangeDelayed = _.debounce((h) => { props.onHourChange(h) }, 100);

    this.state = {
      selected: {
        min: parseInt(props.initialMin ?props.initialMin : 0),
        max: parseInt(props.initialMax ?props.initialMax : 0)
      },
    }
  }

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (evt, gestureState) => this.onMove(evt, gestureState),
    onPanResponderRelease: () => {
      if (this.props.onHourChangeEnd) {
        this.props.onHourChangeEnd(this.state.selected)
      }
    }
  })

  onMove = (evt, gestureState) => {
    let xpos = gestureState.x0 + gestureState.dx

    let offset = (Dimensions.get('window').width - this.props.width) / 2

    let fv = (xpos - offset) / this.props.width * NUM_ITEMS, dv = fv % 1

    if (gestureState.vx > 0) {
      if (dv >= 0.65) { fv = parseInt(fv) + 1 }
      else { fv = parseInt(fv) }
    } else if (gestureState.vx < 0) {
      if (dv <= 0.35) { fv = parseInt(fv) }
      else { fv = parseInt(fv) + 1 }
    }


    let posInsideBar = fv
    if (posInsideBar > NUM_ITEMS - 1) { posInsideBar = NUM_ITEMS - 1 }
    if (posInsideBar < 0) { posInsideBar = 0 }

    let { min, max } = this.state.selected

    if (gestureState.vx > 0) {
      if (posInsideBar === max + 1) {
        max = posInsideBar
      } else if (posInsideBar === min && max !== posInsideBar) {
        min = posInsideBar + 1
      }
    } else {
      if (posInsideBar === min - 1) {
        min = posInsideBar
      } else if (posInsideBar === max && posInsideBar !== min) {
        max = posInsideBar - 1
      }
    }

    this.setState({
      selected: {
        min,
        max
      }
    })
    if (this.props.onSelectMove) {
      this.props.onSelectMove({selected: {min, max}})
    }
  }

  getColor = (i) => {
    let isSelected = i <= this.state.selected.max && this.state.selected.min <= i
    if (isSelected) 
      return 'transparent'

    let padded = `${i+this.props.from}`.padStart(2, '0')
    return COLORS[`${this.props.data[padded].condition}_CARDS`];
  }
  
  getItemWidth = (i, isSub) => {
    const w = this.props.width, margin = parseFloat(w) / NUM_ITEMS * 0.14, isSelected = i <= this.state.selected.max && this.state.selected.min <= i
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

  getSelectedWidth = () => {
    if (this.state.selected.max < this.state.selected.min) {
      return {
        width: 0,
        boderWidth: 0,
      }
    }

    let curCond = null
    for (let i = this.state.selected.min; i <= this.state.selected.max; i++) {
      let padded = `${i+this.props.from}`.padStart(2, '0')
      if (!curCond || conditionsOrdering.indexOf(curCond) >= conditionsOrdering.indexOf(this.props.data[padded].condition)) {
        curCond = this.props.data[padded].condition
      }
    }

    const w = this.props.width, margin = parseFloat(w) / NUM_ITEMS * 0.14
    return {
      width: (this.state.selected.max-this.state.selected.min+1) * (parseFloat(w) / NUM_ITEMS),
      marginHorizontal: 0,
      borderWidth: margin,
      borderColor: '#fff',
      height: 45 + margin,
      position: 'absolute',
      left: this.state.selected.min * this.props.width / NUM_ITEMS,
      backgroundColor: COLORS[`${curCond}_CARDS`],
    }
  }

  getContainerHeight = () => {
    const w = this.props.width, margin = parseFloat(w) / NUM_ITEMS * 0.14
    return 45 + margin
  }

  computeSelected = (prev, idx) => {
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

  render() {
    return (
      <View style={[ styles.container, { width: this.props.width, height: this.getContainerHeight() }]}>
        <View style={[styles.parcelleCursor, { 
          left: -1 * parseFloat(Dimensions.get('window').width - this.props.width) / 2, 
          width: Dimensions.get('window').width,
          height: this.props.cursorHeight||CURSOR_HEIGHT,
        }]} 
          {...this.panResponder.panHandlers}></View>

        <View style={[styles.selected, {
          ...this.getSelectedWidth()
        }]}></View>
        { [...Array(NUM_ITEMS).keys()].map(i => {
          return (
            <TouchableWithoutFeedback key={i} onPress={() => this.onPressParcelle(i)}>
              <View style={[styles.parcelle, {
                ...this.getItemWidth(i)}, 
              ]}>
                <View style={[styles.subTile, { backgroundColor: this.getColor(i), }]}></View>
              </View>
            </TouchableWithoutFeedback>
          )
        }) }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  parcelleCursor: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 10,
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