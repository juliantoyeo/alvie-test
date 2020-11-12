import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { RefreshControl, StyleSheet, View, Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Spinner, Text, Content } from 'native-base'

import i18n from 'i18n-js'
import { getMeteoDetailed } from '../../api/hygoApi'
import { meteoSynced } from '../../store/actions/metaActions'

import { connect } from 'react-redux'
import { meteoByHourType } from '../../types/meteo.types'
import COLORS from '../../colors'

import { Amplitude, AMPLITUDE_EVENTS } from '../../amplitude'
const { meteoDetailedScreen } = AMPLITUDE_EVENTS

import { MeteoContext } from '../../context/meteo.context'
import { PICTO_MAP, PICTO_TO_IMG } from '../../constants';
import Metrics_v2 from '../../components/v2/Metrics_v2';
import _ from 'lodash'
import ModulationBar from '../../components/v2/ModulationBar'
import ModulationBarTiny from '../../components/v2/ModulationBarTiny'
import HourScale from '../../components/v2/HourScale'

const MeteoDetailed_v2 = ({ navigation, lastMeteoLoad, meteoSynced }) => {
    const context = React.useContext(MeteoContext)
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [detailed, setDetailed] = useState({})
    const { currentDay, setCurrentDay } = context
    const [lastLoad, setLastLoad] = useState(-1)
    const [counter, setCounter] = useState(0);

    const pictos: Array<string> = useMemo(() => {
        const ret: Array<string> = []
        if (!context.meteo || context.meteo.length == 0) {
            return []
        }
        // For each day, find the most recurrent picto and place it in variable ret
        _.forEach(context.meteo, (v: Array<meteoByHourType>, k: number) => {
            const pictos: Array<string> = v.map((d) => d.pictocode)
            const r: string = _.head(_(pictos)
                .countBy()
                .entries()
                .maxBy(_.last))
            ret.push(r)
        })
        return ret
    }, [context.meteo])

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

    return (
        <Content
            // refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />} 
            contentContainerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            { //!loading && !!detailed.data && !!detailed.data[currentDay] && !!detailed.days && (
                (
                    <View style={styles.container}>
                        {!!context.meteo && !!context.meteo4h && !!context.conditions && context.conditions.length > 0 && (
                            <React.Fragment>
                                {/*============= Week Tab =================*/}
                                < View style={styles.tabBar}>
                                    {context.dow.map((d, i) => {
                                        const dayName = i18n.t(`days.${d.name.toLowerCase()}`).toUpperCase().slice(0, 3)
                                        return (

                                            <TouchableOpacity
                                                key={i}
                                                style={[styles.tabHeading, { backgroundColor: currentDay == i ? '#fff' : COLORS.DARK_BLUE }]}
                                                onPress={() => { setCurrentDay(i) }}
                                            >
                                                <Text style={[styles.tabText, { flex: 1, color: currentDay == i ? COLORS.DARK_BLUE : '#fff' }]}>{dayName}</Text>
                                                <View style={styles.weatherContainer}>
                                                    <Image source={PICTO_MAP[PICTO_TO_IMG[pictos[i]]]} style={styles.weatherImage} />
                                                </View>
                                                <View style={{ flex: 1, paddingTop: 5 }}>
                                                    <ModulationBarTiny
                                                        data={context.conditions[i]}
                                                        height={8}
                                                        width={60}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>

                                <View style={styles.dayContent}>
                                    {/*=============== Day weather ==============*/}
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


                                    <View style={styles.dayWeather}>
                                        {/*=============== Metrics ==============*/}
                                        {!!context.metrics && (
                                            <Metrics_v2
                                                currentHourMetrics={context.metrics}
                                                hasRacinaire={true}
                                                color="#fff"
                                            />
                                        )}
                                        {/*=============== Conditions ==============*/}
                                        <View style={styles.sliderContainer}>
                                            {/*<HygoParcelleIntervention/>*/}
                                            <ModulationBar
                                                from={0/*parseInt(hour)*/}
                                                initialMax={4}
                                                initialMin={5}
                                                data={context.conditions[currentDay]}
                                                width={Dimensions.get('window').width - 30}
                                                onHourChangeEnd={() => { }}
                                                enabled={false}
                                            />
                                        </View>
                                        <HourScale hour={'00'/*hour*/} color="#fff" />
                                    </View>
                                </View>
                            </React.Fragment>
                        )}
                        {/* =============== Loading Spinner ============= */}
                        { loading && (
                            <View style={styles.container}>
                                <Spinner size={16} color={COLORS.CYAN} style={{ height: 48, marginTop: 48 }} />
                            </View>
                        )}
                        {/* 
                        <View style={styles.pulve}>
                            <Text style={styles.pulveTitle}>{i18n.t('meteo_detailed.pulve_title', { value: detailed.products.length || '' })}</Text>

                            <View style={styles.pulveContainer}>
                                {detailed.products.map(p => {
                                    let dayProduct = detailed.data[currentDay].hours1[p.id].data
                                    return (
                                        <View style={styles.productContainer} key={p.id}>
                                            <Text style={styles.productName}>{i18n.t(`products.${p.name}`)}</Text>
                                            <View style={styles.productCondition}>
                                                {[...Array(24).keys()].map(i => {
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
                                                })}
                                            </View>
                                            <View style={styles.hoursContainer}>
                                                <Text style={styles.hours}>00H</Text>
                                                <Text style={styles.hours}>06H</Text>
                                                <Text style={styles.hours}>12H</Text>
                                                <Text style={styles.hours}>18H</Text>
                                                <Text style={styles.hours}>24H</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>)} */}
                    </View>
                )
            }
        </Content >
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
        paddingBottom: 20,
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
        backgroundColor: COLORS.DARK_BLUE,
        borderRadius: 35,

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
        paddingTop: 10,
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
        paddingTop: 15,
        paddingHorizontal: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.DARK_BLUE
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