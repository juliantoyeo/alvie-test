import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-navigation';
import { ScrollView, StyleSheet, View, StatusBar, Dimensions } from 'react-native';
import { Button, Icon, Left, Right, Body, Header, Title } from 'native-base';

import COLORS from '../colors'
import i18n from 'i18n-js'

import _ from 'lodash'

import HygoParcelleIntervention from '../components/HygoParcelleIntervention'
import HygoButton from '../components/pulverisation-detailed/HygoButton'

import { PADDED, CONDITIONS_ORDERING } from '../constants'

import Map from '../components/pulverisation-detailed/Map';
import Modulation from '../components/pulverisation-detailed/Modulation';
import Metrics from '../components/pulverisation-detailed/Metrics';
import ExtraMetrics from '../components/pulverisation-detailed/ExtraMetrics';
import Cultures from '../components/pulverisation-detailed/Cultures';
import Products from '../components/pulverisation-detailed/Products';
import HourScale from '../components/pulverisation-detailed/HourScale';
import moment from 'moment';

import capitalize from '../utils/capitalize'

const NextPulverisationDetails = ({ result, day, hour, ra, next12HoursData, navigation }) => {
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

  const [selected, setSelected] = useState({
    min: 0,
    max: ra ? parseInt(ra) : 0,
  })

  const [currentHourMetrics, setCurrentHourMetrics] = useState({})
  const [background, setBackground] = useState(COLORS.GREY)
  const [modulationChanged, setModulationChanged] = useState(true)

  const reloadCurrentMetrics = useCallback((selected) => {
    const minval = -99999, maxval = 99999
    let chd = {}, dir = []
    _.forOwn(next12HoursData, (v, k) => {
      if (k === 'ready') { return }
      if (parseInt(k) - parseInt(hour) > selected.max || parseInt(k) - parseInt(hour) < selected.min) {
        return
      }

      chd.wind = Math.max((chd.wind || minval), v.data.wind)
      chd.gust = Math.max((chd.gust || minval), v.data.gust)

      chd.precipitation = (chd.precipitation||0) + v.data.precipitation
      chd.probabilityCnt = (chd.probabilityCnt||0) + 1
      chd.probabilitySum = (chd.probabilitySum||0) + parseFloat(v.data.probability)

      chd.mintemp = Math.min((chd.mintemp || maxval), v.data.mintemp)
      chd.maxtemp = Math.max((chd.maxtemp || minval), v.data.maxtemp)

      chd.minhumi = Math.min((chd.minhumi || maxval), v.data.minhumi)
      chd.maxhumi = Math.max((chd.maxhumi || minval), v.data.maxhumi)

      chd.minsoilhumi = Math.min((chd.minsoilhumi || maxval), v.data.soilhumi)
      chd.maxsoilhumi = Math.max((chd.maxsoilhumi || minval), v.data.soilhumi)

      dir.push(v.data.winddirection)

      _.forOwn(v.parcelle, (v0, k0) => {
        if (parseInt(k) - parseInt(hour) === selected.max) {
          chd.r2 = Math.max((chd.r2 || minval), v0.r2)
          chd.r3 = Math.max((chd.r3 || minval), v0.r3)
          chd.r6 = Math.max((chd.r6 || minval), v0.r6)
        }

        chd.deltatemp = Math.max((chd.deltatemp||minval), v0.deltatemp)
        chd.t3 = Math.min((chd.t3||maxval), v0.t3)
      })
    })

    chd.winddirection = _.head(_(dir).countBy().entries().maxBy(_.last));

    chd.probability = chd.probabilityCnt > 0 ? chd.probabilitySum / chd.probabilityCnt : 0.0

    setCurrentHourMetrics(chd)
  }, [selected, hour, next12HoursData])

  const setBackgroundColor = useCallback((selected) => {
    let curCond = null
    for (let i = selected.min; i <= selected.max; i++) {
      if (!curCond || CONDITIONS_ORDERING[curCond] >= CONDITIONS_ORDERING[next12HoursData[PADDED[i+parseInt(hour)]].condition]) {
        curCond = next12HoursData[PADDED[i+parseInt(hour)]].condition
      }
    }
    setBackground(COLORS[`${curCond}`])
  }, [selected, next12HoursData, hour])

  useEffect(() => {
    reloadCurrentMetrics(selected)
    setBackgroundColor(selected)
  }, [next12HoursData])

  const hasRacinaire = useCallback(() => {
    return result.products.filter(p => p.isRacinaire).length > 0
  }, [result.products])

  const getDay = useCallback(() => {
    let md = moment.utc(day)

    return `${capitalize(DAYS[md.day()])} ${md.date()} ${capitalize(MONTHS[md.month()])}`
  }, [day])

  return (
    <SafeAreaView style={[styles.statusbar, { backgroundColor: background }]} forceInset={{top:'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <Header hasTabs style={[styles.header, { backgroundColor: background }]} androidStatusBarColor={background} iosBarStyle="light-content">
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => navigation.navigate("Pulverisation")}>
              <Icon name='close' style={{ color: '#fff' }} />
            </Button>
          </Left>
          <Body style={styles.headerBody}>
            <Title style={styles.headerTitle}>{getDay()}</Title>
            <Title style={styles.headerTitle}>{i18n.t('meteo_overlay.header', { from: (parseInt(hour)+selected.min)%24, to: (parseInt(hour)+selected.max+1)%24 })}</Title>
          </Body>
          <Right style={{ flex: 1 }}></Right>
        </Header>

        <View style={styles.pulveContainer}>
          <Cultures navigation={navigation} />
          <View style={{ height: 10 }}></View>
          <Products navigation={navigation} />
        </View>

        <View style={styles.details}>
          <Metrics currentHourMetrics={currentHourMetrics} hasRacinaire={hasRacinaire()} />

          <View style={styles.sliderContainer}>
            <HygoParcelleIntervention from={parseInt(hour)} initialMax={selected.max} onHourChangeEnd={(h) => {
              setSelected(h);
              setModulationChanged(true)

              if (h.max < h.min) {
                return
              }
              reloadCurrentMetrics(h)
              setBackgroundColor(h)
            }} data={next12HoursData} width={Dimensions.get('window').width - 30} />
          </View>

          <HourScale hour={hour} />

          <ExtraMetrics currentHourMetrics={currentHourMetrics} />

          <Modulation day={day} hour={hour} selected={selected} modulationChanged={modulationChanged} setModulationChanged={setModulationChanged} />
          <View style={styles.mapviewContainer}>
            <Map parcelles={result.parcelles} region={result.region} min={selected.min} max={selected.max} hour={hour} data={next12HoursData} />
          </View>
          <HygoButton navigation={navigation} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent'
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
    fontSize: 20
  },  
  container: {
    display: 'flex',
  },
  details: {
    backgroundColor: 'transparent',
    display: 'flex',
    paddingTop: 20,
    justifyContent: 'center',
    flex: 1,
  },
  sliderContainer: {
    marginTop: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapviewContainer: {
    backgroundColor: '#fff'
  },
  pulveContainer: {
    paddingRight: 15,
    paddingTop: 30,
    paddingBottom: 10,
  },
});

export default NextPulverisationDetails