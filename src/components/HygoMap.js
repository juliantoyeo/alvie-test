import React, { useState, useEffect, useRef, createRef } from 'react'
import { Dimensions, StyleSheet, View, Alert } from 'react-native'
import  MapView, {Polygon} from 'react-native-maps';

import COLORS from '../colors'

const HygoMap = ({ intervention, handleFieldSelection }) => {
  const [region, setRegion] = useState(null)
  const [selected, setSelected] = useState(null)

  const polygons = useRef([]);
  if (polygons.current.length !== intervention.fields.length) {
    polygons.current = Array(intervention.fields.length).fill().map((_, i) => polygons.current[i] || createRef())
  }

  useEffect(() => {
    if (!intervention.id) { return } 

    setRegion({
      latitude: intervention.avglatCentroid || intervention.fields[0].latCentroid,
      longitude: intervention.avglonCentroid || intervention.fields[0].lonCentroid,
      latitudeDelta: intervention.lat_delta || 0.0222,
      longitudeDelta: intervention.lon_delta || 0.0121,
    })
  }, [intervention])

  const onRegionChange = () => {}

  return (
    <View>
      { region && (
        <MapView
          provider="google"
          mapType="hybrid"
          region={region}
          onRegionChangeComplete={onRegionChange}
          style={styles.map}>

          { intervention.fields.map((field, idx) => {
            return (
              <Polygon
                key={field.id}
                strokeWidth={selected === idx ? 4 : 1}
                strokeColor={selected === idx ? '#fff' : COLORS.DARK_GREEN}
                fillColor={field.colorField||COLORS.DEFAULT_FIELD_MY}
                ref={ref => (polygons.current[idx] = ref)}
                onLayout={() => polygons.current[idx].setNativeProps({
                    fillColor: field.colorField||COLORS.DEFAULT_FIELD_MY
                })}
                tappable={true}
                onPress={() => {
                  let i = idx

                  let newValue = selected === i ? null : i
                  setSelected(newValue)

                  if (handleFieldSelection) {
                    handleFieldSelection(newValue !== null ? intervention.fields[i] : newValue)
                  }
                }}
                coordinates={field.featuresRpg.geometry.coordinates[0].map((coordinate) => {
                  return {
                    latitude: coordinate[1],
                    longitude: coordinate[0],
                  }
                })}
              />  
            );
          })}
        </MapView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    justifyContent :"center",
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    height : Dimensions.get('window').width,
  }
})

export default HygoMap