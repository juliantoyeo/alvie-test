import React, { Component } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, PanResponder, Text, Dimensions } from 'react-native'
import HygoSliderLabel from './HygoSliderLabel';

import COLORS from '../colors'

import _ from 'lodash';

const CURSOR_WIDTH = 48
const CURSOR_HEIGHT = 72

class HygoSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      left: (props.value ? (props.value-props.min)/parseFloat(props.max-props.min)*props.sliderLength : 0) - CURSOR_WIDTH/2,
    }
  }

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (evt, gestureState) => this.onMove(evt, gestureState),
  })

  onMove = (evt, gestureState) => {
    let xpos = gestureState.x0 + gestureState.dx

    let offset = (Dimensions.get('window').width - this.props.sliderLength) / 2

    let posInsideBar = parseFloat(xpos - offset) / this.props.sliderLength * (this.props.max-this.props.min) + this.props.min
    posInsideBar = Math.min(this.props.max, posInsideBar)
    posInsideBar = Math.max(this.props.min, posInsideBar)

    let dst = this.props.max, dstv = null, inc = this.props.increment||1

    for (let i = this.props.min; i <= this.props.max; i += inc) {
      let cd = Math.abs(i - posInsideBar)
      if (cd < dst) {
        dstv = i
        dst = cd
      }
    }

    posInsideBar = dstv
    this.setState({
      left: (posInsideBar-this.props.min)/parseFloat(this.props.max-this.props.min)*this.props.sliderLength - (this.props.cursorWidth||CURSOR_WIDTH)/2, 
    })

    this.props.updateValue(posInsideBar)
  }

  getItemWidth = () => {
    const w = this.props.sliderLength, margin = parseFloat(w) / this.state.num * 0.14
    return {
      width: parseFloat(w) / this.state.num - 2*margin,
      marginHorizontal: margin,
    }
  }

  render() {
    const { left } = this.state

    return (
      <View style={[ styles.container, { marginTop: 60, width: this.props.sliderLength }]}>
        <View style={[styles.bar, { width: this.props.sliderLength }]}></View>
        <View style={[styles.barFilled, { width: (this.props.value-this.props.min)/parseFloat(this.props.max-this.props.min)*this.props.sliderLength }]}></View>

        { [0, 1 ].map(i => {
            let p = (this.props.value-this.props.min)/parseFloat(this.props.max-this.props.min)*this.props.sliderLength
            let w = i*this.props.sliderLength

            return (
              <TouchableWithoutFeedback key={i} onPress={() => {
                this.props.updateValue(parseFloat(i*(this.props.max)))
              }}>
                <View style={{ left: w - 20, position: 'absolute', width: 40, height: 40 }}>
                  <View style={[styles.point, { 
                    left: 15,
                    top: 15,
                    backgroundColor: p < w ? COLORS.GREY : COLORS.CYAN
                  }]}></View>
                </View>
              </TouchableWithoutFeedback>
            )
          }) 
        }

        <View style={[styles.cursor, { 
          left: left, 
          width: CURSOR_WIDTH,
          height: CURSOR_HEIGHT,
          top: -50,
        }]} 
          {...this.panResponder.panHandlers}>
            <HygoSliderLabel value={this.props.value} />
          </View>
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
    backgroundColor: COLORS.GREY,
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

export default HygoSlider

/*
const HygoSlider = ({ sliderLength, min, max, updateValue, steps, value, increment, setScrollEnabled }) => {
  const onValuesChange = values => {
    updateValue(values[0])
  }

  return (
    <View>
      <View style={styles.container}>
        <MultiSlider
          values={[value]}
          sliderLength={sliderLength}
          onValuesChange={onValuesChange}
          min={min}
          max={max}
          step={increment||1}
          allowOverlap={true}
          snapped={true}
          enableLabel
          onValuesChangeStart={() => setScrollEnabled(false)}
          onValuesChangeFinish={() => setScrollEnabled(true)}
          customLabel={HygoSliderLabel}
          trackStyle={{
            backgroundColor: COLORS.GREY
          }}
          selectedStyle={{
            backgroundColor: COLORS.DARK_BLUE
          }}
          markerStyle={{
            backgroundColor: COLORS.DARK_BLUE,
            width: 20,
            height: 20,
            zIndex: 90,
          }}
          touchDimensions={{
            height: 50, width: 50, borderRadius: 15, slipDisplacement: 400
          }}
        />
      </View>
      <View style={[styles.column, { width: sliderLength }]}>
        <HygoSliderItem 
          value={min}
          i={value}
          display
          pointStyle={{ left: 0 }}
        />
        { steps && [...Array(9).keys()].map(i => {
          let k = i+1
          return (
            <HygoSliderItem 
              key={k*10}
              value={parseFloat(k)*max/10.0}
              i={value}
              pointStyle={{ left: k * (sliderLength / 10) - 4, position: 'absolute' }}
            />
          )
        })}
        <HygoSliderItem 
          value={max}
          i={value}
          display
          pointStyle={{ left: 10 }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',
    top: -30,
  },
});

export default HygoSlider
*/