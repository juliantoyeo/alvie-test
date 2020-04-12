import React, { Component } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, PanResponder, Text, Dimensions } from 'react-native'

import COLORS from '../colors'

import _ from 'lodash';

const CURSOR_WIDTH = 24
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

    this.setState({
      left: xpos - offset - 6,
      selected: posInsideBar
    })

    this.onHourChangeDebounce(posInsideBar)
  }

  getColor = (i) => {
    let padded = `${i}`.padStart(2, '0')
    return COLORS[`${this.props.data[padded].condition}_CARDS`];
  }
  
  getItemWidth = () => {
    const w = this.props.width, margin = parseFloat(w) / 24 * 0.14
    return {
      width: parseFloat(w) / 24 - 2*margin,
      marginHorizontal: margin,
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
          width: this.props.cursorWidth||CURSOR_WIDTH,
          height: this.props.cursorHeight||CURSOR_HEIGHT
        }]} 
          {...this.panResponder.panHandlers}></View>

        { [...Array(24).keys()].map(i => {
          return (
            <TouchableWithoutFeedback key={i} onPress={() => this.onPressParcelle(i)}>
              <View style={[styles.parcelle, {
                backgroundColor: this.getColor(i), 
                ...this.getItemWidth()}, 
                i === selected ? styles.selected : {}, 
                i === selected - 1 || i === selected + 1 ? styles.selectedNext : {}
              ]}></View>
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
    height: 20,
    zIndex: 5,
  },
  parcelleCursor: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  selected: {
    height: 30,
    width: 14,
    marginHorizontal: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  selectedNext: {
    height: 25,
    width: 12,
    marginHorizontal: 1,
  },
})

export default HygoParcelleSlider