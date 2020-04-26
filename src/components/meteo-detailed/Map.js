import React, { useCallback, useRef, createRef } from "react";
import { StyleSheet, Dimensions } from 'react-native'
import  MapView, {Polygon} from 'react-native-maps';

import COLORS from '../../colors'

const Map = ({ region, parcelles, selected, setSelected, currentData }) => {
  const getRegion = useCallback(() => {
    let center = {
      longitude: (region.lon_max - region.lon_min) / 2 + region.lon_min,
      latitude: (region.lat_max - region.lat_min) / 2 + region.lat_min,
    }

    let r = {
      ...center,
      longitudeDelta: Math.max(0.0222, Math.abs(region.lon_max - center.longitude)),
      latitudeDelta: Math.max(0.0121, Math.abs(region.lat_max - center.latitude)),
    }

    return r
  }, [region])

  const polygons = useRef([]);
  if (polygons.current.length !== parcelles.length) {
    polygons.current = Array(parcelles.length).fill().map((_, i) => polygons.current[i] || createRef())
  }

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
            strokeWidth={selected === field.id ? 4 : 1}
            strokeColor={selected === field.id ? '#fff' : COLORS.DARK_GREEN}
            fillColor={COLORS[`${currentData[field.id].condition}_CARDS`]}
            ref={ref => (polygons.current[idx] = ref)}
            onLayout={() => polygons.current[idx].setNativeProps({
                fillColor: COLORS[`${currentData[field.id].condition}_CARDS`]
            })}
            tappable={true}
            onPress={() => {
              let i = field.id

              let newValue = selected === i ? null : i
              setSelected(newValue)
            }}
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
    justifyContent: "center",
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    height : Dimensions.get('window').width,
  },
})

export default Map