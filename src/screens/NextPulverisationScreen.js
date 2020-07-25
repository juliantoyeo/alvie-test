import React, { useState, useEffect, useCallback } from 'react'
import { StatusBar, StyleSheet, SafeAreaView, View, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { Content, Header, Left, Body, Right, Button, Icon, Title, Text, Spinner } from 'native-base';
import { connect } from 'react-redux'

import { updatePhytoProductSelected } from '../store/actions/pulveActions'

import i18n from 'i18n-js'

import COLORS from '../colors'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { getMeteoIntervention } from '../api/hygoApi'
import capitalize from '../utils/capitalize'

import {Amplitude, AMPLITUDE_EVENTS} from '../amplitude'
const {nextPulvScreen: ampEvent} = AMPLITUDE_EVENTS

const NextPulverisationScreen = ({ navigation, phytoProductList, cultures, culturesSelected, phytoProductSelected }) => {
  const MONTHS = [
    i18n.t('months.january'),
    i18n.t('months.february'),
    i18n.t('months.march'),
    i18n.t('months.april'),
    i18n.t('months.may'),
    i18n.t('months.june'),
    i18n.t('months.july'),
    i18n.t('months.august'),
    i18n.t('months.september'),
    i18n.t('months.october'),
    i18n.t('months.november'),
    i18n.t('months.december'),
  ]
  
  const DAYS = [
    i18n.t('days.sunday'),
    i18n.t('days.monday'),
    i18n.t('days.tuesday'),
    i18n.t('days.wednesday'),
    i18n.t('days.thursday'),
    i18n.t('days.friday'),
    i18n.t('days.saturday'),
  ]

  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({})
  const [blurred, setBlurred] = useState(false)

  const [currentParams, setCurrentParams] = useState("")

  const openPicker = (screen) => {
    navigation.navigate(screen, {backScreen: 'Pulverisation'})
  }

  useEffect( () => {
    // console.log("Amplitude : ", ampEvent.render)
    Amplitude.logEventWithProperties(ampEvent.render, {
      timestamp: Date.now()
    })
    const unsubscribe = navigation.addListener('didFocus', () => {
      // console.log("Amplitude : ", ampEvent.render)
      Amplitude.logEventWithProperties(ampEvent.render, {
        timestamp: Date.now()
      })
    })
    return () => unsubscribe.remove()
  }, [])

  useEffect(() => {
    if (culturesSelected.length > 0 && phytoProductSelected.length > 0 && !blurred) {
      loadMeteoIntervention()
    }
  }, [culturesSelected, phytoProductSelected, loadMeteoIntervention])
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('didBlur', () => {
      setBlurred(true)
    });

    const unsubscribeFocus = navigation.addListener('willFocus', () => {
      setBlurred(false)
      loadMeteoIntervention()
    });

    return () => {
      unsubscribe.remove()
      unsubscribeFocus.remove()
    };
  }, [navigation, loadMeteoIntervention, culturesSelected, phytoProductSelected, currentParams])

  const loadMeteoIntervention = useCallback(async () => {
    setLoading(true)

    let js = JSON.stringify({
      products: phytoProductSelected,
      cultures: culturesSelected
    })

    if (currentParams === js) {
      setLoading(false)
      return
    }
    setCurrentParams(js)

    let result = await getMeteoIntervention({
      products: phytoProductSelected,
      cultures: culturesSelected
    })

    setData(result)
    setLoading(false)
  }, [setCurrentParams, currentParams, phytoProductSelected, culturesSelected])

  const goToDetails = ({ day, hour, data }) => {
    // console.log("Amplitude : ", ampEvent.click_goToPulvDetails)
    Amplitude.logEventWithProperties(ampEvent.click_goToPulvDetails, {
      timestamp: Date.now()
    })

    navigation.navigate('NextPulverisationDetails', {
      day,
      hour,
      data,
    })
  }

  const formatDay = (d) => {
    let now = new Date(`${d}`)
    return `${capitalize(DAYS[now.getDay()])} ${now.getDate()} ${capitalize(MONTHS[now.getMonth()])}`
  }

  const getWidth = () => {
    return (Dimensions.get('window').width - 64) / 12
  }

  return (
    <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
        <Content style={styles.content}>
          <Header style={styles.header} androidStatusBarColor="transparent" hasTabs transparent iosBarStyle="light-content">
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => navigation.toggleDrawer() }>
                <Icon name='menu' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={styles.headerBody}>
              <Title style={styles.headerTitle}>{i18n.t('pulverisation.header')}</Title>
            </Body>
            <Right style={{ flex: 1 }}></Right>
          </Header>
          <View style={styles.pulveContainer}>
            <TouchableWithoutFeedback onPress={() => openPicker("HygoCulturePicker")}>
              <View style={styles.picker}>
              { culturesSelected.length === 0 && (
                <Text style={styles.pickerText}>{i18n.t('pulverisation.culture_type')}</Text>
              )}
              { culturesSelected.length === cultures.length && (
                <Text style={styles.pickerText}>{i18n.t('pulverisation.all_cultures')}</Text>
              )}
              { culturesSelected.length < cultures.length && culturesSelected.length > 0 && (
                <Text style={styles.pickerText}>{ cultures.filter(pp => culturesSelected.indexOf(pp.id) > -1).map(pp => i18n.t(`cultures.${pp.name}`)).join(', ') }</Text>
              )}
              <Icon style={styles.pickerIcon} type="Feather" name="chevron-down" />
              </View>
            </TouchableWithoutFeedback>

            <View style={{ height: 10 }}></View>

            <TouchableWithoutFeedback onPress={() => openPicker("HygoProductPicker")}>
              <View style={styles.picker}>
                { phytoProductSelected.length === 0 && (
                  <Text style={styles.pickerText}>{i18n.t('pulverisation.product_type')}</Text>
                )}
                { phytoProductSelected.length > 0 && (
                  <Text style={styles.pickerText}>{ phytoProductList.filter(pp => phytoProductSelected.indexOf(pp.id) > -1).map(pp => i18n.t(`products.${pp.name}`)).join(', ') }</Text>
                )}
                <Icon style={styles.pickerIcon} type="Feather" name="chevron-down" />
              </View>
            </TouchableWithoutFeedback>
          </View>

          { (phytoProductSelected.length === 0 || culturesSelected.length === 0) && (
            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>{i18n.t('pulverisation.select_text')}</Text>
            </View>
          )}

          { phytoProductSelected.length > 0 && culturesSelected.length > 0 && (
            <View style={styles.hoursSelector}>
              <Text style={styles.hoursText}>{i18n.t('pulverisation.select_hours_text')}</Text>

              <View style={{ marginTop: 10, marginBottom: 40 }}>
                { loading && (
                  <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
                )}
                { !loading && (
                  <React.Fragment>
                    { data.days && data.days.slice(0, 3).map((d, didx) => {
                      return (
                        <View key={d}>
                          { (((new Date()).getHours() < 12 || didx > 0) && ((new Date()).getHours() >= 12 || didx < 2)) && (
                            <View style={styles.dayLine} key={`${d}-0`}>
                              <Text style={styles.dayText}>{formatDay(d)}</Text>
                              <View style={styles.productCondition}>
                                { [...Array(12).keys()].map(i => {
                                  let padded = `${i}`.padStart(2, '0')
                                  let dayProduct = data.data[d].hours1
                                  return (
                                    <TouchableOpacity key={i} style={[styles.parcelle, {
                                      backgroundColor: COLORS[dayProduct[padded].condition]
                                    }]} onPress={() => goToDetails({
                                      day: d,
                                      hour: padded,
                                      data
                                    })}>
                                      { dayProduct[padded].conflict && (
                                        <Text style={styles.parcelleExclamation}>!</Text>
                                      )}
                                    </TouchableOpacity>
                                  )
                                }) }
                              </View>
                              <View style={styles.hoursDetailsContainer}>
                                <Text style={[styles.hoursDetails, { left: getWidth()}]}>01H</Text>
                                <Text style={[styles.hoursDetails, { left: 3 * getWidth()}]}>03H</Text>
                                <Text style={[styles.hoursDetails, { left: 5 * getWidth()}]}>05H</Text>
                                <Text style={[styles.hoursDetails, { left: 7 * getWidth()}]}>07H</Text>
                                <Text style={[styles.hoursDetails, { left: 9 * getWidth()}]}>09H</Text>
                                <Text style={[styles.hoursDetails, { left: 11 * getWidth()}]}>11H</Text>
                              </View>
                            </View>
                          )}
                          { didx < 2 && (
                            <View style={styles.dayLine} key={`${d}-1`}>
                              <Text style={styles.dayText}>{formatDay(d)}</Text>
                              <View style={styles.productCondition}>
                                { [...Array(12).keys()].map(i => {
                                  let padded = `${i+12}`.padStart(2, '0')
                                  let dayProduct = data.data[d].hours1
                                  return (
                                    <TouchableOpacity key={i} style={[styles.parcelle, {
                                      backgroundColor: COLORS[dayProduct[padded].condition]
                                    }]} onPress={() => goToDetails({
                                      day: d,
                                      hour: padded,
                                      data
                                    })}>
                                      { dayProduct[padded].conflict && (
                                        <Text style={styles.parcelleExclamation}>!</Text>
                                      )}
                                    </TouchableOpacity>
                                  )
                                }) }
                              </View>
                              <View style={styles.hoursDetailsContainer}>
                                <Text style={[styles.hoursDetails, { left: getWidth()}]}>13H</Text>
                                <Text style={[styles.hoursDetails, { left: 3 * getWidth()}]}>15H</Text>
                                <Text style={[styles.hoursDetails, { left: 5 * getWidth()}]}>17H</Text>
                                <Text style={[styles.hoursDetails, { left: 7 * getWidth()}]}>19H</Text>
                                <Text style={[styles.hoursDetails, { left: 9 * getWidth()}]}>21H</Text>
                                <Text style={[styles.hoursDetails, { left: 11 * getWidth()}]}>23H</Text>
                              </View>
                            </View>
                          )}
                        </View>
                      )
                    })}
                    
                  </React.Fragment>
                )}
              </View>
            </View>
          )}
        </Content>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  dayLine: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
  },
  dayText: {
    fontFamily: 'nunito-bold',
    fontSize: 14,
    color: COLORS.DARK_BLUE,
    textTransform: 'uppercase',
  },
  statusbar: { 
    flex: 1, 
    display: 'flex',
    backgroundColor: Platform.OS === 'ios' ? 'black' : COLORS.CYAN,
  },
  container: { 
    flex: 1, 
    display: 'flex', 
  },
  header: {
    backgroundColor: COLORS.CYAN,
  },
  headerBody: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    flex: 6,
  },
  headerTitle: {
    color: '#fff',
    fontFamily: 'nunito-regular',
    fontSize: 24
  },  
  content: {
    flex: 1,
    backgroundColor: '#fff'
  },
  tabBar: { 
    backgroundColor: 'transparent', 
    shadowOffset: { width: 0, height: 0}, 
    elevation: 0,
    borderBottomWidth: 0
  },
  tabStyle: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0
  },
  textStyle: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 14,
    fontFamily: 'nunito-bold',
  },
  pulveContainer: {
    backgroundColor: COLORS.CYAN,
    paddingRight: 15,
    paddingTop: 30,
    paddingBottom: 40,
  },
  picker: {
    shadowColor: '#000',
    shadowOpacity: .2,
    shadowOffset: {
      width: 0,
      height: 3
    },
    elevation: 3,
    backgroundColor: '#fff',
    paddingLeft: 20,
    borderTopRightRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 20,
    paddingVertical: 10,
  },
  pickerText: {
    flex: 1,
    color: COLORS.DARK_BLUE,
    fontSize: 16,
    fontFamily: 'nunito-bold',
  },
  pickerIcon: {
    marginLeft: 5,
    fontSize: 20,
    color: COLORS.DARK_BLUE
  },
  bottomText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'nunito-italic',
  },
  bottomTextContainer: {
    paddingTop: 40,
    paddingLeft: 24,
    paddingRight: 60,
  },
  hoursSelector: {
    backgroundColor: '#fff',
    padding: 22,
    flex: 1,
  },
  hoursText: {
    fontFamily: 'nunito-italic',
    fontSize: 18,
    color: '#6b6b6b',
  },
  productCondition: {
    height: 45,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  parcelle: {
    height: 45,
    zIndex: 5,
    width: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parcelleExclamation: {
    fontFamily: 'nunito-heavy',
    fontSize: 16,
    color: '#fff',
  },
  hoursDetailsContainer: {
    flexDirection: 'row',
    display: 'flex',
  },
  hoursDetails: {
    fontFamily: 'nunito-bold',
    fontSize: 12,
    color: '#aaaaaa',
    position: 'absolute'
  }
})

const mapStateToProps = (state) => ({
  cultures: state.metadata.cultures,
  phytoProductList: state.pulve.phytoProductList,
  culturesSelected: state.pulve.culturesSelected,
  phytoProductSelected: state.pulve.phytoProductSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
  updatePhytoProductSelected: (selected) => dispatch(updatePhytoProductSelected(selected)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NextPulverisationScreen);
