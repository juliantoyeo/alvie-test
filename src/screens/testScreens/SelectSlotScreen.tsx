import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer } from 'native-base';
import { ProductList } from './ProductList';
import HygoButton from'../../components/HygoButton';
import { getInterventions } from '../../api/hygoApi';
import { ModulationContext } from '../../context/modulation.context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from 'i18n-js'
import COLORS from '../../colors'
import Metrics from '../../components/pulverisation-detailed/Metrics';
import HourScale from '../../components/pulverisation-detailed/HourScale';
import ExtraMetrics from '../../components/pulverisation-detailed/ExtraMetrics';
import Modulation from '../../components/pulverisation-detailed/Modulation';
import HygoParcelleIntervention from '../../components/HygoParcelleIntervention';

const PICTO_MAP = {
    'SUN': require('../../../assets/sunny.png'),
    'CLOUD': require('../../../assets/cloudy.png'),
    'STORM': require('../../../assets/stormy.png'),
    'RAIN': require('../../../assets/rainy.png'),
    'SNOW': require('../../../assets/snowy.png'),
  }
const slotsData: any = [
    {
        title: 'LUN',
        pictocode: 'SUN',
        hours4:{
            '0': 'SUN',
            '4': 'SUN',
            '8': 'RAIN',
            '12': 'RAIN',
            '16': 'SUN',
            '20': 'SNOW',
        }
    },
    {
        title: 'MAR',
        pictocode: 'CLOUD',
        hours4:{
            '0': 'SNOW',
            '4': 'SNOW',
            '8': 'SNOW',
            '12': 'SNOW',
            '16': 'SNOW',
            '20': 'SNOW',
        }
    },
    {
        title: 'MER',
        pictocode: 'STORM',
        hours4:{
            '0': 'RAIN',
            '4': 'RAIN',
            '8': 'RAIN',
            '12': 'RAIN',
            '16': 'RAIN',
            '20': 'SNOW',
        }
    },
    {
        title: 'JEU',
        pictocode: 'RAIN',
        hours4:{
            '0': 'SUN',
            '4': 'SUN',
            '8': 'SUN',
            '12': 'SUN',
            '16': 'SUN',
            '20': 'SUN',
        }
    },
    {
        title: 'VEN',
        pictocode: 'SNOW',
        hours4:{
            '0': 'SUN',
            '4': 'SUN',
            '8': 'RAIN',
            '12': 'RAIN',
            '16': 'SUN',
            '20': 'SUN',
        }
    },
]

const hourMetricsData = [
    {
        winddirection: 'S',
        wind: 50,
        gust: 51,
        precipitation: 12,
        probability: 10,
        mintemp: 20,
        maxtemp: 27,
        minhumi: 80,
        maxhumi: 85,
        minsoilhumi: 10,
        maxsoilhumi: 11,
    },
    {
        winddirection: 'N',
        wind: 20,
        gust: 21,
        precipitation: 11,
        probability: 67,
        mintemp: -6,
        maxtemp: 7,
        minhumi: 30,
        maxhumi: 35,
        minsoilhumi: 4,
        maxsoilhumi: 8,
    },
]
const hasRacinaire = () => false

const hour = '11'

const next12HoursData = {
    '00': {condition : 'EXCELLENT'},
    '01': {condition : 'GOOD'},
    '02': {condition : 'CORRECT'},
    '03': {condition : 'BAD'},
    '04': {condition : 'FORBIDDEN'},
    '05': {condition : 'EXCELLENT'},
    '06': {condition : 'GOOD'},
    '07': {condition : 'CORRECT'},
    '08': {condition : 'BAD'},
    '09': {condition : 'FORBIDDEN'},
    '10': {condition : 'EXCELLENT'},
    '11': {condition : 'GOOD'},
    '12': {condition : 'CORRECT'},
    '13': {condition : 'BAD'},
    '14': {condition : 'FORBIDDEN'},
    '15': {condition : 'CORRECT'},
    '16': {condition : 'EXCELLENT'},
    '17': {condition : 'GOOD'},
    '18': {condition : 'BAD'},
    '19': {condition : 'FORBIDDEN'},
    '20': {condition : 'CORRECT'},
    '21': {condition : 'FORBIDDEN'},
    '22': {condition : 'EXCELLENT'},
    '23': {condition : 'CORRECT'},
}
const modData = [ 15, 16, 17, 39,15, 0, 4]
const SelectSlotScreen = ({ navigation }) => {
    const context = React.useContext(ModulationContext) 
    const [currentDay, setCurrentDay] = useState<any>(slotsData[0])
    const [background, setBackground] = useState<any>(COLORS.EXCELLENT)
    const [selected, setSelected] = useState({
        min: 0,
        max: 0 //ra ? parseInt(ra) : 0,
    })
    const [currentHourMetrics, setCurrentHourMetrics] = useState<any>(hourMetricsData[0])
    const [mod, setMod] = useState<any>(modData[0])

    const setBackgroundColor = (h) => {}
    const reloadCurrentMetrics = (h) => {
        console.log((h.max + h.min)%2)
        setCurrentHourMetrics(hourMetricsData[(h.max + h.min)%2])
        setMod(modData[(h.max + h.min)%7])
    }
    
    return (
        <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
            <StatusBar translucent backgroundColor="transparent" />
            <Container contentContainerStyle={[styles.container, StyleSheet.absoluteFill]}>
                <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => navigation.goBack()}>
                            <Icon type='AntDesign' name='arrowleft' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                        <Body style={styles.headerBody}>
                            <Title style={styles.headerTitle}>Pulvérisation</Title>
                            <Title style={styles.headerTitle}>Choix du créneau</Title>
                        </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>
                <Content style={styles.content}>
                    {/*============= Week Tab =================*/}
                    <View style={styles.tabBar}>
                    { slotsData.slice(0, 5).map((d, i)=> {
                        return (
                            <TouchableOpacity key={i} style={[styles.tabHeading, { backgroundColor: currentDay.title === d.title ? '#fff' : COLORS.DARK_BLUE }]} onPress={() => setCurrentDay(d)}>
                            <Text style={[ styles.tabText, { color: currentDay.title === d.title ? COLORS.DARK_BLUE : '#fff' } ]}>{d.title}</Text>
                            <View style={styles.weatherContainer}>
                                <Image source={PICTO_MAP[d.pictocode]} style={styles.weatherImage} />
                            </View>
                            </TouchableOpacity>
                        )
                    })}
                    </View>
                    {/*=============== Day Weather ==============*/}
                    <View style={styles.dayContent}>
                        <View style={styles.hour4Weather}>
                        { ['00', '04', '08', '12', '16', '20' ].map((h, i) => {
                            return (
                                <View key={i} style={styles.hour4WeatherContainer}>
                                    <Text style={styles.hour4WeatherText}>{`${h}h`}</Text>
                                    <Image style={styles.hour4WeatherImage} source={PICTO_MAP[currentDay.hours4[`${parseInt(h)}`]]} />
                                </View>
                            )
                        })}
                        </View>
                    </View>
                    {/*=============== Slot Picker ===============*/}
                    <View style={{ backgroundColor: COLORS.DARK_BLUE}}>
                        <Metrics currentHourMetrics={currentHourMetrics} hasRacinaire={hasRacinaire()} />

                        <View style={styles.sliderContainer}>
                            <HygoParcelleIntervention 
                                from={parseInt(hour)} 
                                //initialMax={selected.max} 
                                data={next12HoursData} 
                                width={Dimensions.get('window').width - 30} 
                                onHourChangeEnd={(h) => {
                                    setSelected(h);
                                    // setModulationChanged(true)

                                    if (h.max < h.min) {
                                        return
                                    }
                                    reloadCurrentMetrics(h)
                                    setBackgroundColor(h)
                                }} 
                            />
                        </View>

                        <HourScale hour={hour} />

                        <ExtraMetrics currentHourMetrics={currentHourMetrics} />
                    </View>

                    {/*================= Result ==================*/}
                    {/* <Modulation day={day} hour={hour} selected={selected} modulationChanged={modulationChanged} setModulationChanged={setModulationChanged} /> */}
                    <Text style={{backgroundColor:COLORS.BEIGE}}>Modulation : {mod}%</Text>
                </Content>            
            </Container>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    statusbar: { 
      flex: 1, 
      display: 'flex',
      backgroundColor: Platform.OS === 'ios' ? 'black' : COLORS.CYAN,
    },
    container: { 
      backgroundColor: COLORS.BEIGE,
      flexDirection:"column",
      display: 'flex', 
    },
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
      fontSize: 24
    },  
    title: {
      paddingTop:20,
      paddingLeft:10,
      textTransform: 'uppercase',
      fontFamily: 'nunito-bold',
      fontSize: 16,
      color: COLORS.CYAN
    },
    content: {
      backgroundColor: COLORS.BEIGE
    },
    footer:{
      backgroundColor: COLORS.BEIGE
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "black",
        opacity: 0.7
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
      sliderContainer: {
        marginTop: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
  });
  
  const mapStateToProps = (state) => ({
    
  });
  
  const mapDispatchToProps = (dispatch, props) => ({
    
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SelectSlotScreen);