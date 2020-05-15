import React, { useState, useEffect, useRef, createRef } from 'react'
import { Dimensions, StyleSheet, View, Alert } from 'react-native'
import  MapView, {Polygon} from 'react-native-maps';

import COLORS from '../colors'

const HygoMap = ({ intervention, byParcelle, handleFieldSelection }) => {
  const [mapregion, setRegion] = useState(null)
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
      { mapregion && (
        <MapView
          provider="google"
          mapType="hybrid"
          initialRegion={mapregion}
          style={styles.map}>

          { intervention.fields.map((field, idx) => {
            return (
              <Polygon
                key={idx}
                strokeWidth={selected === idx ? 4 : 1}
                strokeColor={selected === idx ? '#fff' : COLORS.DARK_GREEN}
                fillColor={byParcelle[field.parcelleId] && byParcelle[field.parcelleId].condition ? COLORS[byParcelle[field.parcelleId].condition] : (field.colorField||COLORS.DEFAULT_FIELD_MY)}
                ref={ref => (polygons.current[idx] = ref)}
                onLayout={() => polygons.current[idx].setNativeProps({
                    fillColor: byParcelle[field.parcelleId] && byParcelle[field.parcelleId].condition ? COLORS[byParcelle[field.parcelleId].condition] : (field.colorField||COLORS.DEFAULT_FIELD_MY)
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