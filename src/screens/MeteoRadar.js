import React, { useState, useEffect } from 'react'
import { Dimensions, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
import  MapView, { Overlay} from 'react-native-maps';
import { getMeteoRadar } from '../api/hygoApi';

import { Spinner, Button, Icon } from 'native-base'

import HygoRadarSlider from '../components/HygoRadarSlider'

import COLORS from '../colors'

const factor = 7388/7553

const MeteoRadar = ({ navigation, active }) => {
  let interval = null

  const [loading, setLoading] = useState(true)
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [images, setImages] = useState([])
  const [paused, setPaused] = useState(false)

  const [region, setRegion] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(0)

  const coords = {
    lon_min: -9.518991999949419,
    lon_max: 13.721623908424407,

    lat_min: 39.79171589293103,
    lat_max: 53.86656657651131,
  }

  useEffect(() => {
    loadMeteoRadar()
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('willBlur', () => {
      console.log("BLUR1")
      clearInterval(interval)
    });

    return () => {
      unsubscribe.remove()
    };
  }, [navigation])

  useEffect(() => {
    if (active && !paused && images.length > 0) {
      interval = setInterval(() => {
        setCurrentWeather(prev => {
          return (prev + 1) % images.length;
        })
      }, 300);
    } else if (paused || !active) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [paused, images, active]);

  const loadMeteoRadar = async () => {
    const res = await getMeteoRadar()

    for (let i = 0; i < res.length; i++) {
      if (i < 10) {
        await Image.prefetch(res[i].url)
        setLoadingPercent((i+1)*10)
      } else {
        Image.prefetch(res[i].url)
      }
    }

    setImages(res)
    setLoading(false)
  }

  useEffect(() => {
    let center = {
      latitude: (coords.lat_max - coords.lat_min) / 2 + coords.lat_min,
      longitude: (coords.lon_max - coords.lon_min) / 2 + coords.lon_min,
    }

    setRegion({
      ...center,
      latitudeDelta: Math.abs(center.latitude - coords.lat_min),
      longitudeDelta: Math.abs(center.longitude - coords.lon_min),
    })
  }, [])

  return (
    <View style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      { loading && (
        <View style={styles.mapContainer}>
          <Spinner size={16} color={COLORS.CYAN} style={{ height: 48, marginTop: 48 }} />
          <Text style={styles.loadingPercent}>{`${loadingPercent}%`}</Text>
        </View>
      )}
      { region && !loading && (
        <View style={styles.mapContainer}>
          <MapView
            provider="google"
            mapType="hybrid"
            initialRegion={region}
            style={styles.map}>

            <Overlay image={images[currentWeather].url} 
              bounds={[[coords.lat_max * factor, coords.lon_min], [coords.lat_min, coords.lon_max]]} opacity={0.1} />

          </MapView>

          <View style={{ left: 20, position: 'absolute', bottom: 120 }}>
          <HygoRadarSlider width={Dimensions.get('window').width - 40} progress={parseFloat(currentWeather)/(images.length-1)} updateProgress={(i) => {
            setCurrentWeather(i*(images.length-1))
          }} />
          </View>

          <View style={styles.radarContainer}>
            <Text style={styles.radarText}>{images[currentWeather].d}</Text>
            <View style={styles.controls}>
              <TouchableOpacity style={styles.button} rounded icon onPress={() => setPaused(prev => !prev)}>
                <Icon style={styles.icon} type="Foundation" name={paused ? "play" : "pause"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mapContainer: { 
    flex: 1, 
    display: 'flex', 
    paddingTop: 20,
  },
  map: {
    width: Dimensions.get('window').width,
    flex: 1,
  },
  radarContainer: {
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80,
    left: Dimensions.get('window').width / 2 - 60
  },
  radarText: {
    color: '#fff',
    fontFamily: 'nunito-heavy',
    fontSize: 16,
  },
  loadingPercent: {
    color: COLORS.CYAN,
    fontFamily: 'nunito-heavy',
    fontSize: 14,
  },
  controls: {
    display: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: COLORS.CYAN,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginHorizontal: 5
  },
  iconRewind: {
    color: '#fff',
    fontSize: 24,
    left: -1
  },
  icon: {
    color: '#fff',
    fontSize: 24,
    left: 1
  }
})

export default MeteoRadar