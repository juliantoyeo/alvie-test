import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer, Spinner } from 'native-base';
import { ProductList } from './ProductList';
import HygoButton from '../../components/v2/HygoButton';
import { HygoCard } from '../../components/v2/HygoCards';
import { getInterventions } from '../../api/hygoApi';
import { ModulationContext } from '../../context/modulation.context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from 'i18n-js';
import COLORS from '../../colors';
import hygoStyles from '../../styles'
import Metrics from '../../components/pulverisation-detailed/Metrics';
import HourScale from '../../components/v2/HourScale';
import ExtraMetrics from '../../components/pulverisation-detailed/ExtraMetrics';
import Modulation from '../../components/pulverisation-detailed/Modulation';
import ModulationBar from '../../components/v2/ModulationBar';
import { hourMetricsData, daysData, next12HoursData, modData } from './staticData';
import moment from 'moment';

import { getMeteoDetailed_v2, getModulationValue_v2 } from '../../api/hygoApi';
import { meteoByHourType, meteoDataType } from '../../types/meteo.types';
import { activeProductType } from '../../types/activeproduct.types';
import { fieldType } from '../../types/field.types';
import { modulationType } from '../../types/modulation.types';

const PICTO_MAP = {
    'SUN': require('../../../assets/sunny.png'),
    'CLOUD': require('../../../assets/cloudy.png'),
    'STORM': require('../../../assets/stormy.png'),
    'RAIN': require('../../../assets/rainy.png'),
    'SNOW': require('../../../assets/snowy.png'),
}

const hasRacinaire = () => false

const SelectSlotScreen = ({ navigation }) => {
    const context = React.useContext(ModulationContext)
    const [currentDay, setCurrentDay] = useState<number>(0)
    const [background, setBackground] = useState<any>(COLORS.EXCELLENT)
    const [meteoData, setMeteoData] = useState<Array<meteoDataType>>([])
    const [currentHourMetrics, setCurrentHourMetrics] = useState<any>(hourMetricsData[0])
    const [currentNext12HoursData, setCurrentNextHoursData] = useState<any>(next12HoursData[0])
    const totalArea = context.selectedFields.reduce((r, f) => r + f.area, 0)        //in meters^2
    const totalPhyto = totalArea * context.selectedProducts.reduce((r, p) => r + p.dose, 0) / 10000

    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [detailed, setDetailed] = useState({})

    const modAvg = context.mod.length > 0 ? context.mod.reduce((sum, m) => sum + m.mod, 0) / context.mod.length : 0

    // Loading meteo : every hour and 4hours merged for the next 5 days 
    useEffect(() => {
        const loadMeteo = async () => {
            let now = moment.utc('2020-08-08')
            if (now.minutes() >= 30) {
                now.hours(now.hours() + 1)
            }
            now = now.startOf('day')
            // array of the 5 next days to iterate on
            const dt = [...Array(5).keys()].map((i) => now.add(i==0 ? 0 : 1, 'day').format('YYYY-MM-DD'))
            const data: Array<meteoDataType> = await Promise.all(dt.map( (d) => getMeteoDetailed_v2(d)))
            setMeteoData(data)
            setLoading(false)
        }
        setLoading(true)
        loadMeteo()
    }, [])

    useEffect(() => {
        onSelectedSlotchange()
    }, [context.selectedSlot])
    
    const onSelectedSlotchange = async () => {
        setIsRefreshing(true)
        const products:Array<number> = context.selectedProducts.map((p:activeProductType) => p.phytoproduct.id)
        const cultures:Array<number> = context.selectedFields.map((f:fieldType) => f.culture.id)
        const now = moment.utc('2020-05-05')
        const data={
            hour: "00",
            day: now.format('YYYY-MM-DD'),
            cultures,
            products,
            selected: { 
                min: context.selectedSlot.min, 
                max: context.selectedSlot.max
            }
        }
        const newMod:Array<modulationType> = await getModulationValue_v2(data)
        context.setMod(newMod)
        setIsRefreshing(false)
    }
    const updateDay = (i) => {

    }
    
    return (
        <SafeAreaView style={styles.statusbar} forceInset={{ top: 'always' }}>
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
                {loading ? (
                <Spinner size={16} color={COLORS.CYAN} style={{ height: 48, marginTop: 48 }} />
                )
                : (
                <View>
                    {/*============= Week Tab =================*/}
                    <View style={styles.tabBar}>
                        {meteoData.map((d, i) => {
                            const dayName = i18n.t(`days.${d.day.toLowerCase()}`).toUpperCase().slice(0,3) 
                            return (
                                <TouchableOpacity 
                                    key={i} 
                                    style={[styles.tabHeading, { backgroundColor: currentDay == i ? '#fff' : COLORS.DARK_BLUE }]} 
                                    onPress={() =>{setCurrentDay(i)} }
                                >
                                    <Text style={[styles.tabText, { color: currentDay == i ? COLORS.DARK_BLUE : '#fff' }]}>{dayName}</Text>
                                    {/* <View style={styles.weatherContainer}>
                                        <Image source={PICTO_MAP[d.pictoDay]} style={styles.weatherImage} />
                                    </View> */}
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    {/*=============== Day Weather ==============*/}
                    <View style={styles.dayContent}>
                        <View style={styles.hour4Weather}>
                            {meteoData[currentDay].meteoBy4Hour.map((m, i) => {
                                return (
                                    <View key={i} style={styles.hour4WeatherContainer}>
                                        <Text style={styles.hour4WeatherText}>{`${m.hour}h`}</Text>
                                        <Image style={styles.hour4WeatherImage} source={PICTO_MAP[m.pictocode]} />
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                    {/*=============== Slot Picker ===============*/}
                    <View style={{ backgroundColor: COLORS.DARK_BLUE }}>
                        <Title style={styles.hourTitle}>{context.selectedSlot.min}h - {context.selectedSlot.max + 1}h</Title>
                        <View style={{ paddingBottom: 20 }}>
                            <Metrics currentHourMetrics={currentHourMetrics} hasRacinaire={hasRacinaire()} />
                        </View>

                        <View style={styles.sliderContainer}>
                            {/*<HygoParcelleIntervention/>*/}
                            <ModulationBar
                                from={0/*parseInt(hour)*/}
                                initialMax={context.selectedSlot.max}
                                initialMin={context.selectedSlot.min}
                                data={currentNext12HoursData}
                                width={Dimensions.get('window').width - 30}
                                onHourChangeEnd={(h) => {context.setSelectedSlot(h);}}
                            />
                        </View>

                        <HourScale hour={'00'/*hour*/} />

                        {/* <ExtraMetrics currentHourMetrics={currentHourMetrics} /> */}
                    </View>

                    {/*================= Result ==================*/}
                    {/* <Modulation day={day} hour={hour} selected={context.selected} modulationChanged={modulationChanged} setModulationChanged={setModulationChanged} /> */}
                    <View style={{ paddingTop: 20, paddingBottom: 40 }}>
                        <HygoCard>
                            { isRefreshing ? <Spinner/> : (
                            <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[hygoStyles.h0, { padding: 0, paddingBottom: 0, fontSize: 16, }]}>Total économisé</Text>
                                <Text style={[hygoStyles.h0, { padding: 0, paddingBottom: 0, fontSize: 24 }]}>
                                    {`${(totalPhyto * modAvg / 100).toFixed(1)}L (${modAvg.toFixed(0)}%)`}
                                </Text>
                            </View>
                            )}
                        </HygoCard>
                    </View>
                </View>
                )}
                </Content>
                {!loading && (
                    <Footer style={styles.footer}>
                        <HygoButton
                            label="AFFICHER LE RÉCAPITULATIF"
                            onPress={() => {
                                context.setMetrics(currentHourMetrics)
                                navigation.navigate('TestPageReport')
                            }
                            }
                            icon={{
                                type: 'AntDesign',
                                name: 'arrowright',
                                fontSize: 26,
                            }} />
                    </Footer>
                )}
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
        flexDirection: "column",
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
        paddingTop: 20,
        paddingLeft: 10,
        textTransform: 'uppercase',
        fontFamily: 'nunito-bold',
        fontSize: 16,
        color: COLORS.CYAN
    },
    content: {
        backgroundColor: COLORS.BEIGE
    },
    footer: {
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
        //marginTop: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    hourTitle: {
        color: '#FFF',
        textTransform: 'uppercase',
        fontFamily: 'nunito-bold',
        fontSize: 26,
        paddingTop: 20
    }
});

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch, props) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(SelectSlotScreen);