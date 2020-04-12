import React, { Component } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, PanResponder, Text, Dimensions } from 'react-native'

import COLORS from '../colors'

import _ from 'lodash';

const CURSOR_WIDTH = 24
const CURSOR_HEIGHT = 36

class HygoRadarSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: props.start||0,
    }
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
        <View style={[styles.bar, { width: this.props.width }]}></View>
        <View style={[styles.barFilled, { width: this.props.progress*this.props.width }]}></View>

        { [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map(i => {
          let p = this.props.progress*this.props.width
          let w = i*this.props.width/12

          return (
            <TouchableWithoutFeedback key={i} onPress={() => {
              this.props.updateProgress(parseFloat(i)/12)
            }}>
              <View style={{ left: w - 20, position: 'absolute', width: 40, height: 40 }}>
                <View style={[styles.point, { 
                  left: 15,
                  top: 15,
                  backgroundColor: p < w ? '#fff' : COLORS.CYAN
                }]}></View>
              </View>
            </TouchableWithoutFeedback>
          )
        }) }

        <View style={[styles.cursor, { 
          left: 0, 
          width: this.props.cursorWidth||CURSOR_WIDTH,
          height: this.props.cursorHeight||CURSOR_HEIGHT
        }]} 
          {...this.panResponder.panHandlers}></View>
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
  bar: {
    height: 4,
    backgroundColor: '#fff',
  },  
  cursor: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  point: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    position: 'absolute',
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
  barFilled: {
    backgroundColor: COLORS.CYAN,
    height: 4,
    position: 'absolute',
    left: 0,
    zIndex: 999,
  }
})

export default HygoRadarSlider