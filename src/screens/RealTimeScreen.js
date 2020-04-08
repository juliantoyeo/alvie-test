import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Picker } from 'native-base';
import { getRealtimeData, updateUI } from '../api/hygoApi';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

import LogoLoading from '../components/LogoLoading'

import i18n from 'i18n-js'

import COLORS from '../colors'

import HygoChart from '../components/HygoChart';
import HygoProductList from '../components/HygoProductList'

const RealTimeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [history, setHistory] = useState([])
  const [last, setLast] = useState({})
  const [ui, setUi] = useState({})

  const [color, setColor] = useState(COLORS.GREY)
  const [secondaryColor, setSecondaryColor] = useState(COLORS.GREY)

  useEffect(() => {
    loadRealtimeData()
  }, [])

  const loadRealtimeData = async () => {
    let { history, last, ui } = await getRealtimeData()

    setHistory(history)
    setLast(last)
    setUi(ui)

    updateColors(ui.raw)

    setLoading(false)
  }

  const getLastHour = (dt, separator) => {
    let d = new Date(dt || last.timestamp)
    return `${d.getHours()}${separator||':'}${("0"+(d.getMinutes())).slice(-2)}`
  }

  const onRefresh = async () => {
    setIsRefreshing(true)
    await loadRealtimeData()
    setIsRefreshing(false)
  }

  const onProductChange = async (value) => {
    setUi(await updateUI(value))
    updateColors(ui.raw)
    onRefresh()
  }

  const updateColors = (c) => {
    setColor(COLORS[c])
    setSecondaryColor(COLORS[`${c}_SECONDARY`])
  }

  return (
    <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <Container style={styles.content}>
        <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => navigation.toggleDrawer() }>
              <Icon name='menu' style={{ color: '#fff' }} />
            </Button>
          </Left>
          <Body style={styles.headerBody}>
            <Title style={styles.headerTitle}>{i18n.t('realtime.header')}</Title>
          </Body>
          <Right style={{ flex: 1 }}></Right>
        </Header>

        { loading && (
          <View style={[StyleSheet.absoluteFill, {display: 'flex', alignItems: 'center', justifyContent: 'center'}]}>
            <LogoLoading color={COLORS.CYAN} duration={1000} />
          </View>
        )}

        { !loading && (
          <Content contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.BEIGE, padding: 0, disableKBDismissScroll: true }} 
              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
          
          { history.length > 0 && (
            <View>
              <View style={[styles.headerCondition, { backgroundColor: color }]}>
                <Text style={styles.textCondition}>{ui.condition}</Text>
              </View>
              <View style={styles.lastHour}>
                <Text style={styles.lastHourText}>{i18n.t('realtime.last_hour', { value: getLastHour() })}</Text>
              </View>

              <View style={{ paddingRight: 15}}>
                <View style={styles.picker}>
                  <HygoProductList onProductChange={(v) => {
                    onProductChange(v)
                  }} />
                </View>
              </View>
              <View style={styles.gaugeContainer}>
                <View style={styles.gaugeElement}>
                  <AnimatedCircularProgress
                    size={90}
                    width={8}
                    fill={(last.temp+20)/parseFloat(70)*100}
                    rotation={0}
                    tintColor={color}
                    backgroundColor="#fff">{() => (
                      <Image source={require('../../assets/thermo.png')} style={{ width: 30 ,height: 60, resizeMode: 'contain', tintColor: '#aaa' }}/>
                    )}</AnimatedCircularProgress>
                  <Text style={styles.gaugeText}>{`${last.temp}°C`}</Text>
                </View>

                <View style={styles.gaugeElement}>
                  <AnimatedCircularProgress
                    size={90}
                    width={8}
                    fill={last.humi}
                    rotation={0}
                    tintColor={color}
                    backgroundColor="#fff">{() => (
                      <Image source={require('../../assets/ICN-Hygro.png')} style={{ width: 30 ,height: 60, resizeMode: 'contain', tintColor: '#aaa' }}/>
                    )}</AnimatedCircularProgress>
                  <Text style={styles.gaugeText}>{`${last.humi}%`}</Text>
                </View>

                { typeof last.wind !== 'undefined' && (
                  <AnimatedCircularProgress
                    size={90}
                    width={8}
                    fill={30}
                    rotation={0}
                    tintColor={COLORS.EXCELLENT}
                    backgroundColor="#fff">{() => (
                      <Image source={require('../../assets/ICN-Wind.png')} style={{ width: 30 ,height: 60, resizeMode: 'contain', tintColor: '#aaa' }}/>
                    )}</AnimatedCircularProgress>
                )}
              </View>

              <HygoChart label="Température" data={history.slice(0,8).map(h => {
                return { x: new Date(h.timestamp), y: h.temp }
              })} mainColor={color} secondaryColor={secondaryColor} />

              <HygoChart label="Hygrométrie" data={history.slice(0,8).map(h => {
                return { x: new Date(h.timestamp), y: h.humi }
              })} mainColor={color} secondaryColor={secondaryColor} />

              <View style={{ paddingHorizontal: 32, marginTop: 40 }}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>{i18n.t('realtime.next_cuve')}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 60 }} />
            </View>
          )}

          { history.length === 0 && (
            <>
              <View style={{ flex: 2 }} />
              <Text textAlign="center" style={styles.text}>{i18n.t('realtime.no_data')}</Text>
              <View style={{ flex: 2 }} />
            </>
          )}
          </Content>
        )}
      </Container>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  statusbar: { 
    flex: 1, 
    display: 'flex',
  },
  container: { 
    flex: 1, 
    display: 'flex', 
  },
  header: {
    backgroundColor: COLORS.CYAN
  },
  headerBody: {
    flex: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontFamily: 'nunito-regular',
    fontSize: 24
  },  
  text: {
    color: COLORS.DARK_GREEN,
    textAlign: 'center',
    fontSize: 18,
    flex: 1,
    fontFamily: 'nunito-regular'
  },
  gaugeContainer: {
    padding: 25,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 40,
    justifyContent: 'space-around',
  },
  headerCondition: {
    padding: 15,
    backgroundColor: COLORS.EXCELLENT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#888',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  textCondition: {
    textTransform: 'uppercase',
    color: '#fff',
    fontFamily: 'nunito-heavy',
    fontSize: 14,
  },
  lastHour: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  lastHourText: {
    fontFamily: 'nunito-heavy',
    fontSize: 12,
    color: '#aaaaaa',
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
    paddingLeft: 15,
    borderTopRightRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20,
  },
  pickerText: {
    flex: 1,
    color: '#aaa',
    fontSize: 16,
    fontFamily: 'nunito-regular',
  },
  gaugeElement: {
    display: 'flex',
    alignItems: 'center'
  },
  gaugeText: {
    marginTop: 10,
    fontFamily: 'nunito-regular',
    fontSize: 24,
    color: '#aaa',
  },
  button: {
    borderRadius: 40,
    paddingVertical: 20,
    backgroundColor: COLORS.DARK_BLUE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'nunito-heavy',
    textTransform: 'uppercase'
  }
})

export default RealTimeScreen