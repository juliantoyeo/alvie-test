import React, { useState, useEffect } from 'react'
import { RefreshControl, StyleSheet, View, Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Spinner, Text, Content } from 'native-base'

import i18n from 'i18n-js'
import { getMeteoDetailed } from '../../api/hygoApi'
import { meteoSynced } from '../../store/actions/metaActions'

import { connect } from 'react-redux'

import COLORS from '../../colors'

import {Amplitude, AMPLITUDE_EVENTS} from '../../amplitude'
const { meteoDetailedScreen } = AMPLITUDE_EVENTS

const PICTO_MAP = {
  'SUN': require('../../../assets/sunny.png'),
  'CLOUD': require('../../../assets/cloudy.png'),
  'STORM': require('../../../assets/stormy.png'),
  'RAIN': require('../../../assets/rainy.png'),
  'SNOW': require('../../../assets/snowy.png'),
}

const MeteoDetailed_v2 = ({ navigation, lastMeteoLoad, meteoSynced }) => {
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [detailed, setDetailed] = useState({})
  const [currentDay, setCurrentDay] = useState(null)

  const [lastLoad, setLastLoad] = useState(-1)
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let interval

    const u1 = navigation.addListener('didFocus', () => {
      interval = setInterval(() => {
        setCounter(new Date().getTime());
      }, 30000);
      setCounter(new Date().getTime());
    });

    const u2 = navigation.addListener('willBlur', () => {
      clearInterval(interval);
    });

    interval = setInterval(() => {
      setCounter(new Date().getTime());
    }, 30000);
    setCounter(new Date().getTime());

    return () => {
      u1.remove()
      u2.remove()
    };
  }, []);

  useEffect(() => {
    if (counter - lastLoad >= 300000) {
      loadMeteoDetailed()
    }
  }, [counter])

  const loadMeteoDetailed = async () => {
    if (!loading) {
      setIsRefreshing(true)
    }

    let result = await getMeteoDetailed({
      day: null,
      product: null,
    })
    setDetailed(result)

    setCurrentDay(prev => {
      if (prev === null) {
        return result.days[0]
      }
      return prev
    })

    meteoSynced((new Date()).getTime())

    setLoading(false)
    setIsRefreshing(false)
  }

  const onRefresh = async () => {
    setIsRefreshing(true)
    await loadMeteoDetailed(true)
    setIsRefreshing(false)
  }

  const goToDetails = ({ day, product }) => {

    // console.log("Amplitude : ", meteoDetailedScreen.click_goToPulvDetails)
    Amplitude.logEventWithProperties(meteoDetailedScreen.click_goToPulvDetails, {
      timestamp: Date.now()
    })

    navigation.navigate('LoadingScreen', {
      next: 'MeteoDetailedDetails',
      params: {
        day,
        product
      },
      action: getMeteoDetailed
    })
  }

  return (
    <Content refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />} contentContainerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      { loading && (
        <View style={styles.container}>
          <Spinner size={16} color={COLORS.CYAN} style={{ height: 48, marginTop: 48 }} />
        </View>
      )}

      { !loading && !!detailed.data && !!detailed.data[currentDay] && !!detailed.days && (
        <View style={styles.container}>
          <View style={styles.tabBar}>
            { detailed.days.slice(0, 5).map(d => {
              let data = detailed.data[d].data
              return (
                <TouchableOpacity key={d} style={[styles.tabHeading, { backgroundColor: currentDay === d ? '#fff' : COLORS.DARK_BLUE }]} onPress={() => setCurrentDay(d)}>
                  <Text style={[ styles.tabText, { color: currentDay === d ? COLORS.DARK_BLUE : '#fff' } ]}>{i18n.t(`meteo_detailed.days_${detailed.data[d].meta.dow}`)}</Text>
                  <View style={styles.weatherContainer}>
                    <Image source={PICTO_MAP[data.pictocode]} style={styles.weatherImage} />
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
          <View style={styles.dayContent}>
            <View style={styles.dayWeather}>
              <View style={styles.dayWeatherItemContainer}>
                <Image source={require('../../../assets/ICN-Wind.png')} style={styles.dayWeatherItemImage} />
                <Text style={styles.dayWeatherItemText}>{`${Math.round(detailed.data[currentDay].data.wind)} km/h`}</Text>
                <Text style={styles.dayWeatherItemText}>{`${Math.round(detailed.data[currentDay].data.gust)} km/h`}</Text>
              </View>
              <View style={styles.dayWeatherItemContainer}>
                <Image source={require('../../../assets/ICN-Rain.png')} style={styles.dayWeatherItemImage} />
                <Text style={styles.dayWeatherItemText}>{`${Math.round(parseFloat(detailed.data[currentDay].data.precipitation))} mm`}</Text>
                <Text style={styles.dayWeatherItemText}>{`${Math.round(parseFloat(detailed.data[currentDay].data.probability))}%`}</Text>
              </View>
              <View style={styles.dayWeatherItemContainer}>
                <Image source={require('../../../assets/ICN-Temperature.png')} style={styles.dayWeatherItemImage} />
                <Text style={styles.dayWeatherItemText}>{`${Math.round(parseFloat(detailed.data[currentDay].data.mintemp))}°C`}</Text>
                <Text style={styles.dayWeatherItemText}>{`${Math.round(parseFloat(detailed.data[currentDay].data.maxtemp))}°C`}</Text>
              </View>
              <View style={styles.dayWeatherItemContainer}>
                <Image source={require('../../../assets/ICN-Hygro.png')} style={styles.dayWeatherItemImage} />
                <Text style={styles.dayWeatherItemText}>{`${Math.round(parseFloat(detailed.data[currentDay].data.minhumi))}%`}</Text>
                <Text style={styles.dayWeatherItemText}>{`${Math.round(parseFloat(detailed.data[currentDay].data.maxhumi))}%`}</Text>
              </View>
            </View>
            <View style={styles.hour4Weather}>
              { ['00', '04', '08', '12', '16', '20' ].map(h => {
                return (
                  <View key={h} style={styles.hour4WeatherContainer}>
                    <Text style={styles.hour4WeatherText}>{`${h}h`}</Text>
                    <Image style={styles.hour4WeatherImage} source={PICTO_MAP[detailed.data[currentDay].hours4[`${parseInt(h)}`].pictocode]} />
                  </View>
                )
              })}
            </View>
          </View>
          <View style={styles.pulve}>
            <Text style={styles.pulveTitle}>{i18n.t('meteo_detailed.pulve_title', { value: detailed.products.length || '' })}</Text>

            <View style={styles.pulveContainer}>
              { detailed.products.map(p => {
                let dayProduct = detailed.data[currentDay].hours1[p.id].data
                return (
                  <TouchableWithoutFeedback onPress={() => {
                    goToDetails({
                      product: p.id,
                      day: currentDay,
                    })
                  }} key={p.id}>
                    <View style={styles.productContainer}>
                      <Text style={styles.productName}>{i18n.t(`products.${p.name}`)}</Text>
                      <View style={styles.productCondition}>
                        { [...Array(24).keys()].map(i => {
                          let padded = `${i}`.padStart(2, '0')
                          return (
                            <View key={i} style={[styles.parcelle, {
                              backgroundColor: COLORS[dayProduct[padded].condition]
                            }]}>
                              { dayProduct[padded].conflict && (
                                <Text style={styles.parcelleExclamation}>!</Text>
                              )}
                            </View>
                          )
                        }) }
                      </View>
                      <View style={styles.hoursContainer}>
                        <Text style={styles.hours}>00H</Text>
                        <Text style={styles.hours}>06H</Text>
                        <Text style={styles.hours}>12H</Text>
                        <Text style={styles.hours}>18H</Text>
                        <Text style={styles.hours}>24H</Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                )
              })}
            </View>
          </View>          
        </View>
      )}
    </Content>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    display: 'flex', 
    paddingBottom: 80,
    paddingTop: 20,
  },
  hoursContainer: { 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
  },
  hours: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'nunito-regular'
  },
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
  },  
  tabHeading: {
    padding: 15,
    width: Dimensions.get('window').width / 5 - 4,
    backgroundColor: COLORS.DARK_BLUE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 20,
    marginHorizontal: 2,
  },
  tabText: {
    fontFamily: 'nunito-heavy',
    fontSize: 14,
    color: '#fff',
  },
  weatherContainer: {
    padding: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BEIGE,
    marginTop: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherImage: {
    width: 24,
    height: 24,
    tintColor: COLORS.DARK_BLUE
  },
  dayContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 20,
    shadowColor: '#000',
    elevation: 3,
    shadowOpacity: .2,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
  },
  dayWeather: {
    backgroundColor: COLORS.BEIGE,
    paddingVertical: 10,
    borderRadius: 35,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  dayWeatherItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayWeatherItemImage: {
    width: 24,
    resizeMode: 'contain',
    tintColor: COLORS.DARK_BLUE,
  },
  dayWeatherItemText: {
    fontFamily: 'nunito-bold',
    fontSize: 14,
    color: COLORS.DARK_BLUE,
  },
  hour4Weather: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    paddingBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  hour4WeatherContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hour4WeatherText: {
    fontSize: 14,
    fontFamily: 'nunito-regular',
    color: '#aaa',
  },
  hour4WeatherImage: {
    marginTop: 5,
    width: 24,
    height: 24,
    resizeMode: 'cover',
    tintColor: COLORS.DARK_BLUE,
  },
  pulve: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    backgroundColor: '#fff',
  },
  pulveTitle: {
    fontFamily: 'nunito-heavy',
    fontSize: 14,
    color: COLORS.DARK_BLUE,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  productContainer: {
    marginTop: 10,
  },
  productName: {
    fontFamily: 'nunito-regular',
    fontSize: 14,
    color: '#aaa',
  },
  productCondition: {
    height: 20,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  parcelle: {
    height: 20,
    zIndex: 5,
    width: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parcelleExclamation: {
    fontFamily: 'nunito-heavy',
    fontSize: 16,
    color: '#fff',
  }
})

const mapStateToProps = (state) => ({
  lastMeteoLoad: state.metadata.lastMeteoLoad,
});

const mapDispatchToProps = (dispatch, props) => ({
  meteoSynced: (d) => dispatch(meteoSynced(d))
})

export default connect(mapStateToProps, mapDispatchToProps)(MeteoDetailed_v2);