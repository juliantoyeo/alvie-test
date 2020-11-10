import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer, Spinner } from 'native-base';
import HygoButton from '../../components/v2/HygoButton';
import { HygoCard } from '../../components/v2/HygoCards';
import { ModulationContext } from '../../context/modulation.context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from 'i18n-js';
import COLORS from '../../colors';
import hygoStyles from '../../styles'
import Metrics from '../../components/pulverisation-detailed/Metrics';
import HourScale from '../../components/v2/HourScale';
import ExtraMetrics from '../../components/pulverisation-detailed/ExtraMetrics';
import ModulationBar from '../../components/v2/ModulationBar';
import ModulationBarTiny from '../../components/v2/ModulationBarTiny';

import { PICTO_MAP, PICTO_TO_IMG } from '../../constants';

import moment from 'moment';
import _ from 'lodash';

import { getMeteoDetailed_v2, getModulationValue_v2, getConditions_v2, getMetrics_v2, getMetrics4h_v2 } from '../../api/hygoApi';
import { meteoByHourType, meteoDataType } from '../../types/meteo.types';
import { activeProductType } from '../../types/activeproduct.types';
import { fieldType } from '../../types/field.types';
import { modulationType } from '../../types/modulation.types';
import { conditionType } from '../../types/condition.types';
import { SnackbarContext } from '../../context/snackbar.context';

import { Amplitude, AMPLITUDE_EVENTS } from '../../amplitude'
const { pulv2_slot } = AMPLITUDE_EVENTS

type dailyConditionType = Array<conditionType>
type metricsType = {
    wind?: any,
    gust?: any
    precipitation?: any,
    probabilityCnt?: any,
    probabilitySum?: any,
    prevprecipitation?: any,
    mintemp?: any,
    maxtemp?: any,
    minhumi?: any,
    maxhumi?: any,
    minsoilhumi?: any,
    maxsoilhumi?: any,
    r2?: any,
    r3?: any,
    r6?: any,
    deltatemp?: any,
    t3?: any,
    winddirection?: any,
    probability?: any
}

const SelectSlotScreen = ({ navigation, phytoProductList }) => {
    const context = React.useContext(ModulationContext)
    const snackbar = React.useContext(SnackbarContext)
    const { currentDay, setCurrentDay, metrics, setMetrics } = context
    const [isRefreshing, setIsRefreshing] = useState(false)
    const ready = !!context.meteo && !!metrics && !!context.conditions

    const totalArea = context.selectedFields.reduce((r, f) => r + f.area, 0)        //in meters^2
    const totalPhyto = totalArea * context.selectedProducts.reduce((r, p) => r + p.dose, 0) / 10000
    const modAvg = context.mod.length > 0 ? context.mod.reduce((sum, m) => sum + m.mod, 0) / context.mod.length : 0

    //Updating modulation when selected slot change or day change
    useEffect(() => {
        (currentDay < 3) ? loadModulation() : snackbar.showSnackbar(i18n.t('pulve_slotscreen.snack_nomod'), "WARNING")
        loadMetrics()
    }, [context.selectedSlot, currentDay])

    useEffect(() => {
        loadMetrics()
    }, [context.meteo])

    useEffect(() => {
        context.loadConditions()
    }, [context.selectedProducts])

    const hasRacinaire = useCallback(() => {
        return context.selectedProducts.filter(sp => {
            const family = phytoProductList.find((p) => p.id == sp.phytoproduct.id)
            return family && family.isRacinaire
        }).length > 0
    }, [])

    const loadMetrics = useCallback(async () => {

        if (context.meteo == null) {
            setMetrics(null)
            return
        }
        const minval = -99999, maxval = 99999
        const selected = context.selectedSlot
        let chd: metricsType = {}, dir = []
        _.forEach(context.meteo[currentDay], (v, k2) => {
            const h = v.hour.toString().padStart(2, '0')
            if (parseInt(h) > selected.max || parseInt(h) < selected.min) {
                return
            }
            chd.wind = Math.max((chd.wind || minval), v.wind)
            chd.gust = Math.max((chd.gust || minval), v.gust)

            chd.precipitation = (chd.precipitation || 0) + v.precipitation
            chd.probabilityCnt = (chd.probabilityCnt || 0) + 1
            chd.probabilitySum = (chd.probabilitySum || 0) + parseFloat(v.probability)

            chd.prevprecipitation = (chd.prevprecipitation || 0) + (parseInt(h) < selected.max ? v.precipitation : 0)

            chd.mintemp = Math.min((chd.mintemp || maxval), v.mintemp)
            chd.maxtemp = Math.max((chd.maxtemp || minval), v.maxtemp)

            chd.minhumi = Math.min((chd.minhumi || maxval), v.minhumi)
            chd.maxhumi = Math.max((chd.maxhumi || minval), v.maxhumi)

            chd.minsoilhumi = Math.min((chd.minsoilhumi || maxval), v.soilhumi)
            chd.maxsoilhumi = Math.max((chd.maxsoilhumi || minval), v.soilhumi)

            dir.push(v.winddirection)

            chd.r2 = Math.max((chd.r2 || minval), v.r2)
            chd.r3 = Math.max((chd.r3 || minval), v.r3)
            chd.r6 = Math.max((chd.r6 || minval), v.r6)
            chd.t3 = Math.min((chd.t3 || maxval), v.t3)

            chd.deltatemp = Math.max((chd.deltatemp || minval), v.deltatemp)
        })

        chd.winddirection = _.head(_(dir).countBy().entries().maxBy(_.last));
        chd.probability = chd.probabilityCnt > 0 ? chd.probabilitySum / chd.probabilityCnt : 0.0
        setMetrics(chd)
    }, [context.selectedSlot, context.meteo, currentDay])

    // const loadConditions = async () => {
    //     let now = moment.utc()
    //     if (now.minutes() >= 30) {
    //         now.hours(now.hours() + 1)
    //     }
    //     now = now.startOf('day')
    //     // array of the 5 next days to iterate on
    //     const dt = [...Array(5).keys()].map((i) => now.add(i == 0 ? 0 : 1, 'day').format('YYYY-MM-DD'))
    //     try {
    //         const data: Array<dailyConditionType> = await Promise.all(
    //             dt.map((day) => {
    //                 return (getConditions_v2({
    //                     day,
    //                     products: context.selectedProducts.map((p) => p.phytoproduct.id),
    //                     parcelles: context.selectedFields.map((f) => f.id)
    //                 }))
    //             }
    //             ))
    //         setConditions(data)
    //     } catch (e) {
    //         setConditions(null)
    //         snackbar.showSnackbar("Erreur dans le chargement des conditions", "ALERT")
    //     }
    // }

    const loadModulation = async () => {
        setIsRefreshing(true)
        const products: Array<number> = context.selectedProducts.map((p: activeProductType) => p.phytoproduct.id)
        const cultures: Array<number> = context.selectedFields.map((f: fieldType) => f.culture.id)
        const now = moment.utc()
        const hour = context.selectedSlot.min.toString().padStart(2, '0')
        const data = {
            hour,
            day: now.add(currentDay, 'day').format('YYYY-MM-DD'),
            cultures,
            products,
            selected: {
                min: 0,
                max: context.selectedSlot.max - context.selectedSlot.min
            }
        }

        const newMod: Array<modulationType> = await getModulationValue_v2(data)
        context.setMod(newMod)
        setIsRefreshing(false)
        if (newMod.length == 0) {
            snackbar.showSnackbar(i18n.t('snackbar.mod_error'), "ALERT")
        }

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
                        <Title style={styles.headerTitle}>{i18n.t('pulve_slotscreen.title')}</Title>
                        <Title style={styles.headerSubtitle}>{i18n.t('pulve_slotscreen.subtitle')}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>
                <Content style={styles.content}>
                    {!ready ? (
                        <Spinner size={16} color={COLORS.CYAN} style={{ height: 48, marginTop: 48 }} />
                    )
                        : (
                            <View>
                                {/*============= Week Tab =================*/}
                                <View style={styles.tabBar}>
                                    {context.dow.map((d, i) => {
                                        const dayName = i18n.t(`days.${d.name.toLowerCase()}`).toUpperCase().slice(0, 3)
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                style={[styles.tabHeading, { backgroundColor: currentDay == i ? '#fff' : COLORS.DARK_BLUE }]}
                                                onPress={() => { setCurrentDay(i) }}
                                            //disabled={isRefreshing}
                                            >
                                                <Text style={[styles.tabText, { flex: 1, color: currentDay == i ? COLORS.DARK_BLUE : '#fff' }]}>{dayName}</Text>
                                                <View style={{ flex: 1, paddingTop: 5 }}>
                                                    <ModulationBarTiny
                                                        data={context.conditions[i]}
                                                        height={8}
                                                        width={60}
                                                    />
                                                </View>
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
                                        {context.meteo4h[currentDay].map((m, i) => {
                                            return (
                                                <View key={i} style={styles.hour4WeatherContainer}>
                                                    <Text style={styles.hour4WeatherText}>{`${m.dthour}h`}</Text>
                                                    <Image style={styles.hour4WeatherImage} source={PICTO_MAP[PICTO_TO_IMG[m.pictocode]]} />
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                                {/*=============== Slot Picker ===============*/}
                                <View style={{ backgroundColor: COLORS.DARK_BLUE }}>
                                    <Title style={styles.hourTitle}>{context.selectedSlot.min}h - {context.selectedSlot.max + 1}h</Title>
                                    <View style={{ paddingBottom: 20 }}>
                                        <Metrics currentHourMetrics={metrics} hasRacinaire={hasRacinaire()} />
                                    </View>

                                    <View style={styles.sliderContainer}>
                                        {/*<HygoParcelleIntervention/>*/}
                                        <ModulationBar
                                            from={0/*parseInt(hour)*/}
                                            initialMax={context.selectedSlot.max}
                                            initialMin={context.selectedSlot.min}
                                            data={context.conditions[currentDay]}
                                            width={Dimensions.get('window').width - 30}
                                            onHourChangeEnd={(selected) => context.setSelectedSlot(selected)}
                                            enabled={!isRefreshing}
                                        />
                                    </View>

                                    <HourScale hour={'00'/*hour*/} />

                                    <ExtraMetrics currentHourMetrics={metrics} />
                                </View>

                                {/**
                                 * ================= Result ==================
                                 * display only for the first 3 days
                                 *=========================================*/}

                                {/* <Modulation day={day} hour={hour} selected={context.selected} modulationChanged={modulationChanged} setModulationChanged={setModulationChanged} /> */}
                                <View style={{ paddingTop: 20, paddingBottom: 40 }}>
                                    {currentDay < 3 && (
                                        <HygoCard>
                                            {isRefreshing ? <Spinner /> : (
                                                <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={[hygoStyles.h0, { padding: 0, paddingBottom: 0, fontSize: 16, }]}>{i18n.t('pulve_slotscreen.total')}</Text>
                                                    <Text style={[hygoStyles.h0, { padding: 0, paddingBottom: 0, fontSize: 24 }]}>
                                                        {`${(totalPhyto * modAvg / 100).toFixed(1)}L (${modAvg.toFixed(0)}%)`}
                                                    </Text>
                                                </View>
                                            )}
                                        </HygoCard>
                                    )}
                                </View>
                            </View>
                        )}
                </Content>
                {ready && (
                    <Footer style={styles.footer}>
                        <HygoButton
                            label={i18n.t('pulve_slotscreen.button_next').toUpperCase()}
                            onPress={async () => {
                                Amplitude.logEventWithProperties(pulv2_slot.click_toPulv2Report, {
                                    timestamp: Date.now(),
                                    context
                                })
                                navigation.navigate('Pulverisation_Report')
                            }
                            }
                            enabled={currentDay < 3 && !isRefreshing}
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
        backgroundColor: COLORS.CYAN,
        paddingTop: 0
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
    headerSubtitle: {
        color: '#fff',
        fontFamily: 'nunito-regular',
        fontSize: 20,
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
        padding: 10,
        width: Dimensions.get('window').width / 5 - 4,
        backgroundColor: COLORS.DARK_BLUE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    phytoProductList: state.pulve.phytoProductList
});

const mapDispatchToProps = (dispatch, props) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(SelectSlotScreen);