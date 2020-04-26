import React, { Component } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, PanResponder, Text, Dimensions } from 'react-native'

import COLORS from '../../colors'

import _ from 'lodash';

const CURSOR_HEIGHT = 36

class HygoParcelleSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      left: (props.start * props.width / 24)||0,
      selected: props.start||0,
    }

    this.onHourChangeDebounce = _.debounce(props.onHourChange, 10);
  }

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (evt, gestureState) => this.onMove(evt, gestureState),
  })

  onMove = (evt, gestureState) => {
    let xpos = gestureState.x0 + gestureState.dx

    let offset = (Dimensions.get('window').width - this.props.width) / 2

    let posInsideBar = Math.round((xpos - offset) / this.props.width * 24)
    if (posInsideBar > 23) { posInsideBar = 23 }
    if (posInsideBar < 0) { posInsideBar = 0 }

    this.setState({
      left: xpos - offset - 6,
      selected: posInsideBar
    })

    this.onHourChangeDebounce(posInsideBar)
  }

  getItemWidth = (i, isSub) => {
    const w = this.props.width, margin = parseFloat(w) / 24 * 0.14

    const { selected } = this.state

    if (isSub) {
      return {
        width: parseFloat(w) / 24 - 2*(i === selected ? 0 : (i === selected - 1 || i === selected + 1 ? 1 : margin)),
      }
    }

    return {
      width: parseFloat(w) / 24 - 2*(i === selected ? (-1) : (i === selected - 1 || i === selected + 1 ? 1 : 0)),
      paddingHorizontal: i === selected ? 0 : (i === selected - 1 || i === selected + 1 ? 1 : margin),
    }
  }

  onPressParcelle = (i) => {
    this.setState({
      selected: i,
      left: i * this.props.width / 24
    })
    this.onHourChangeDebounce(i)
  }

  render() {
    const { left, selected } = this.state

    return (
      <View style={[ styles.container, { width: this.props.width }]}>
        <View style={[styles.parcelleCursor, { 
          left: left, 
          width: this.props.width/8,
          height: this.props.cursorHeight||CURSOR_HEIGHT
        }]} 
          {...this.panResponder.panHandlers}></View>

        { [...Array(24).keys()].map(i => {
          let padded = `${i}`.padStart(2, '0')
          return (
            <TouchableWithoutFeedback key={i} onPress={() => this.onPressParcelle(i)}>
              <View style={[styles.parcelle, {
                ...this.getItemWidth(i)}, 
              ]}>
                <View style={[styles.subTile,  
                  i === selected ? styles.selected : {}, 
                  i === selected - 1 || i === selected + 1 ? styles.selectedNext : {},
                  { backgroundColor: COLORS[`${this.props.data[padded].condition}_CARDS`], 
                  ...this.getItemWidth(i, true)
                }]}>
                { this.props.data[padded].conflict && (
                  <Text style={styles.parcelleExclamation}>!</Text>
                )}
                </View>
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
  parcelle: {
    height: 40,
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTile: {
    height: 20,
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parcelleCursor: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  selected: {
    height: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  selectedNext: {
    height: 25,
  },
  parcelleExclamation: {
    fontFamily: 'nunito-heavy',
    fontSize: 16,
    color: '#fff',
  }
})

export default HygoParcelleSlider