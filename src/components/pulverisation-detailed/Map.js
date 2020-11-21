import React, { useCallback, useRef, createRef } from 'react'

import { StyleSheet, Dimensions } from 'react-native'

import  MapView, {Polygon} from 'react-native-maps';

import COLORS from '../../colors'

import { PADDED, CONDITIONS_ORDERING } from '../../constants'

const Map = ({ region, parcelles, hour, min, max, data }) => {
  const polygons = useRef([]);
  if (polygons.current.length !== parcelles.length) {
    polygons.current = Array(parcelles.length).fill().map((_, i) => polygons.current[i] || createRef())
  }

  const getFieldColor = useCallback((fieldId) => {
    let curCond = null
    for (let i = min; i <= max; i++) {
      let padded = PADDED[i+parseInt(hour)]
      if (!curCond || CONDITIONS_ORDERING[curCond] >= CONDITIONS_ORDERING[data[padded].parcelle[fieldId].condition]) {
        if (data[padded].parcelle[fieldId]) {
          curCond = data[padded].parcelle[fieldId].condition
        }
      }
    }

    if (curCond === null) {
      return COLORS.DEFAULT_FIELD
    }

    return COLORS[`${curCond}_CARDS`]
  }, [min, max, data, hour])

  const getRegion = useCallback(() => {
    let center = {
      longitude: (region.lon_max - region.lon_min) / 2 + region.lon_min,
      latitude: (region.lat_max - region.lat_min) / 2 + region.lat_min,
    }

    let r = {
      ...center,
      longitudeDelta: Math.max(0.0222, 2 * Math.abs(region.lon_max - center.longitude)),
      latitudeDelta: Math.max(0.0121, 2 * Math.abs(region.lat_max - center.latitude)),
    }

    return r
  }, [region])

  return (
    <MapView
      provider="google"
      mapType="hybrid"
      initialRegion={getRegion()}
      style={styles.map}>

      { Object.values(parcelles).map((field, idx) => {
        return (
          <Polygon
            key={field.id}
            strokeWidth={1}
            strokeColor={COLORS.DARK_GREEN}
            fillColor={getFieldColor(field.id)}
            _ref={ref => (polygons.current[idx] = ref)}
            onLayout={() => polygons.current[idx].setNativeProps({
                fillColor: getFieldColor(field.id)
            })}
            coordinates={field.features.coordinates[0].map((coordinate) => {
              return {
                latitude: coordinate[1],
                longitude: coordinate[0],
              }
            })}
          />  
        );
      })}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    top: -20,
    justifyContent :"center",
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    height : Dimensions.get('window').width,
  },
})

export default Map