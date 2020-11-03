import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native'
import { Spinner } from 'native-base'
import { HygoCardTransparent } from '../components/v2/HygoCards'
import i18n from 'i18n-js'
import capitalize from '../utils/capitalize'
import COLORS from '../colors'
import moment from 'moment-timezone'
import { getMeteo } from '../api/hygoApi'

const MeteoBriefScreen_v2 = ({ navigation }) => {

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

  const [loading, setLoading] = useState(true)
  const [meteoData, setMeteoData] = useState<any>({})
  const [lastLoad, setLastLoad] = useState(-1)
  const [counter, setCounter] = useState(0);
  const [hourRange, setHourRange] = useState({
    start: '',
    end: ''
  })
  const loadMeteo = async () => {
    let meteo = await getMeteo()
    setMeteoData(meteo)

    setHourRange({
      start: getHour(false),
      end: getHour(true),
    })

    setLastLoad(new Date().getTime())
    setLoading(false)
  }

  const getDay = () => {
    let now = new Date()
    return `${now.getDate()} ${capitalize(MONTHS[now.getMonth()])}`
  }

  const getHour = (isEnd) => {
    let now = moment.utc()
    if (now.minutes() >= 30) {
        now.hours(now.hours() + 1)
    }
    if (isEnd) {
      now.hours(now.hours() + 3)
    }
    now = now.startOf('hour')
    now = now.tz('Europe/Paris').format('HH')

    return now
  }

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
    if (counter - lastLoad >= 60000) {
      loadMeteo()
    }
  }, [counter])

  return (
    <ScrollView>
      <View style={styles.textContainer}>
        <Text style={styles.date}>{getDay()}</Text>
        <Text style={styles.next_3hours}>{i18n.t('meteo.next_3_hours', { from: hourRange.start, to: hourRange.end })}</Text>
      </View>
      <View style={styles.iconContainer}>
        <View style={styles.meteoElement}>
          <Image source={require('../../assets/ICN-Wind.png')} style={styles.image} />
          { loading && (
            <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
          )}
          { !loading && (
            <React.Fragment>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.wind)} km/h`}</Text>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.gust)} km/h`}</Text>
            </React.Fragment>
          )}
        </View>
        <View style={styles.meteoElement}>
          <Image source={require('../../assets/ICN-Rain.png')} style={styles.image} />
          { loading && (
            <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
          )}
          { !loading && (
            <React.Fragment>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.precipitation)} mm`}</Text>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.probability)}%`}</Text>
            </React.Fragment>
          )}
        </View>
        <View style={styles.meteoElement}>
          <Image source={require('../../assets/ICN-Temperature.png')} style={styles.image} />
          { loading && (
            <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
          )}
          { !loading && (
            <React.Fragment>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.mintemp)}°C`}</Text>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.maxtemp)}°C`}</Text>
            </React.Fragment>
          )}
        </View>
        <View style={styles.meteoElement}>
          <Image source={require('../../assets/ICN-Hygro.png')} style={styles.image} />
          { loading && (
            <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
          )}
          { !loading && (
            <React.Fragment>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.minhumi)}%`}</Text>
              <Text style={styles.iconText}>{`${Math.round(meteoData.next3hours.maxhumi)}%`}</Text>
            </React.Fragment>
          )}
        </View>
      </View>
      
      <View style={styles.actionCards}>
        {/*{ loading && (
          <Spinner size={16} color={COLORS.CYAN} style={{ height: 16, marginTop: 16 }} />
        )}
        */}

        {/* !loading && meteoData.products.map(p => {
            return (
              <HygoMeteoPhyto key={p.id} product={p} navigation={navigation} day={moment().format('YYYY-MM-DD')} hour={parseInt(moment().format('HH'))} />
            )
        })*/}
        <HygoCardTransparent
            title= "Pulvérisation"
            subtitle= ""
            text="Démarrer un travail de pulvérisation"
            buttonText= "Démarrer"
            onPress={() => navigation.navigate("Pulverisation_v2")}
        />
        <View style={{ height: 80 }}></View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  date: {
    fontFamily: 'nunito-bold',
    fontSize: 32,
    color: '#fff'
  },
  next_3hours: {
    fontFamily: 'nunito-regular',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center'
  },
  textContainer: {
    display: 'flex', 
    alignItems: 'center',
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 15
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: 45,
    paddingRight: 45,
    paddingTop: 15,
    flexDirection: 'row',
  },
  iconText: {
    fontFamily: 'nunito-bold',
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  meteoElement: {
    display: 'flex',
    alignItems: 'center',
  },
  actionCards: {
    paddingRight: 15,
    marginTop: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  image: {
    marginBottom: 10,
  }
})

export default MeteoBriefScreen_v2