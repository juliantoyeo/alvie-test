import React from 'react';
import { StyleSheet, View } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import HygoSliderLabel from './HygoSliderLabel';
import HygoSliderItem from './HygoSliderItem';

import COLORS from '../colors'

const HygoSlider = ({ sliderLength, min, max, updateValue, steps, value }) => {
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
          step={1}
          allowOverlap={false}
          snapped={true}
          enableLabel
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
          }}
          touchDimensions={{
            height: 80, width: 80, borderRadius: 15
          }}
        />
      </View>
      <View style={[styles.column, { width: sliderLength }]}>
        <HygoSliderItem 
          value={min}
          i={value}
          display
          pointStyle={{ left: -10 }}
        />
        { steps && [...Array(9).keys()].map(i => {
          let k = i+1
          return (
            <HygoSliderItem 
              key={k*10}
              value={k*10}
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