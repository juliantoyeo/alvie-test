import React, { useState, useEffect, useRef, createRef } from 'react'
import  MapView, {Polygon} from 'react-native-maps';

import { SafeAreaView } from 'react-navigation';
import { Dimensions, StyleSheet, View, Text, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Left, Right, Body, Title, Header, Button, Icon } from 'native-base';

import COLORS from '../colors';
import i18n from 'i18n-js';

const FieldsScreen = ({ navigation }) => {
  let result = navigation.getParam('result')

  const [selected, setSelected] = useState(null)
  const [legend, setLegend] = useState(i18n.t('fields.parcelles', { value: result.fields.length }))

  const getRegion = () => {
    let center = {
      longitude: (result.region.lon_max - result.region.lon_min) / 2 + result.region.lon_min,
      latitude: (result.region.lat_max - result.region.lat_min) / 2 + result.region.lat_min,
    }

    let r = {
      ...center,
      longitudeDelta: Math.max(0.0222, Math.abs(result.region.lon_max - center.longitude)),
      latitudeDelta: Math.max(0.0121, Math.abs(result.region.lat_max - center.latitude)),
    }

    return r
  }

  useEffect(() => {
    if (selected !== null) {
      setLegend(i18n.t('fields.culture', { value: result.fields[selected].culture_name||i18n.t('fields.unknown') }))
    } else {
      setLegend(i18n.t('fields.parcelles', { value: result.fields.length }))
    }
  }, [selected])

  const polygons = useRef([]);
  if (polygons.current.length !== result.length) {
    polygons.current = Array(result.length).fill().map((_, i) => polygons.current[i] || createRef())
  }

  return (
    <SafeAreaView style={styles.statusbar} forceInset={{top: 'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
        <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
          <Left style={{ flex: 1 }}>
            { result && (
              <Button transparent onPress={() => navigation.goBack()}>
                <Icon name='close' style={{ color: '#fff' }} />
              </Button>
            )}
          </Left>
          <Body style={styles.headerBody}>
            <Title style={styles.headerTitle}>{i18n.t('fields.header')}</Title>
          </Body>
          <Right style={{ flex: 1 }}></Right>
        </Header>
        
        <View style={styles.container}>
          <MapView
            provider="google"
            mapType="hybrid"
            initialRegion={getRegion()}
            style={styles.map}>

            { result.fields.map((field, idx) => {
              return (
                <Polygon
                  key={field.id}
                  strokeWidth={selected === idx ? 4 : 1}
                  strokeColor={selected === idx ? '#fff' : COLORS.DARK_GREEN}
                  fillColor={selected === idx ? COLORS.CYAN : COLORS.DEFAULT_FIELD_MY}
                  ref={ref => (polygons.current[idx] = ref)}
                  onLayout={() => polygons.current[idx].setNativeProps({
                      fillColor: selected === idx ? COLORS.CYAN : COLORS.DEFAULT_FIELD_MY
                  })}
                  tappable={true}
                  onPress={() => {
                    let i = idx
  
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

          <View style={styles.overlay}>
            <Text style={styles.overlayText}>{legend}</Text>
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.CYAN
  },
  headerBody: {
    flex: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontFamily: 'nunito-regular',
    fontSize: 20
  },  
  statusbar: { backgroundColor: COLORS.BEIGE, flex: 1 },
  map: {
    justifyContent :"center",
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    height : Dimensions.get('window').width,
  },
  container: { justifyContent: 'center', flex: 1, display: 'flex', paddingLeft: 15, paddingRight: 15, alignItems: 'center' },
  overlay: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: .2,
    shadowRadius: 3,
    elevation: 3,
    width: Dimensions.get('window').width - 30,
    top: -25,
  },
  overlayText: {
    fontSize: 16,
    fontFamily: 'nunito-bold',
    color: COLORS.DARK_GREEN,
  }
});

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch, props) => ({})
  
export default connect(mapStateToProps, mapDispatchToProps)(FieldsScreen);