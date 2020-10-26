import React, { useState, useEffect, useRef, createRef } from 'react'
import MapView, { Polygon } from 'react-native-maps';

import { SafeAreaView } from 'react-navigation';
import { Dimensions, StyleSheet, View, Text, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Left, Right, Body, Title, Header, Button, Icon, Content } from 'native-base';

import COLORS from '../colors';
import i18n from 'i18n-js';

import { Amplitude, AMPLITUDE_EVENTS } from '../amplitude'
const { fieldsScreen: ampEvent } = AMPLITUDE_EVENTS


// <Picker
//                       mode='dropdown'
//                       selectedValue={value}
//                       onValueChange={(v, i)=>{
//                         setValue(v)
//                       }}
//                     >
//                           { items.map((v, i) => <Picker.Item label={v} value={v} key={i}/>)}     
//                     </Picker>


const HygoCard = ({ title, children }) => {
    return (
        <View style={[styles.hygocard, { backgroundColor: '#fff' }]}>

            { !!title && (
                <View style={{ minHeight: 26, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {/* <Text style={[styles.h1, {flex: 1}]}>{title}</Text> */}
                    <Text>{title}</Text>
                </View>)}

            {children}
        </View>
    )
}
HygoCard.defaultProps = {
    title: undefined,
    style: {}
}

const FieldsScreen = ({ navigation, parcelles }) => {
    const [selectedFieldIdx, setSelectedFieldIdx] = useState<number>(null)

    useEffect(() => {
        // console.log("Amplitude : ", ampEvent.render)
        Amplitude.logEventWithProperties(ampEvent.render, {
            timestamp: Date.now()
        })
    }, [])

    const getRegion = () => {
        let center = {
            longitude: (parcelles.region.lon_max - parcelles.region.lon_min) / 2 + parcelles.region.lon_min,
            latitude: (parcelles.region.lat_max - parcelles.region.lat_min) / 2 + parcelles.region.lat_min,
        }

        let r = {
            ...center,
            longitudeDelta: Math.max(0.0222, Math.abs(parcelles.region.lon_max - center.longitude)),
            latitudeDelta: Math.max(0.0121, Math.abs(parcelles.region.lat_max - center.latitude)),
        }

        return r
    }

    const polygons = useRef([]);
    if (polygons.current.length !== parcelles.length) {
        polygons.current = Array(parcelles.length).fill().map((_, i) => polygons.current[i] || createRef())
    }

    return (
        <SafeAreaView style={styles.statusbar} forceInset={{ top: 'always' }}>
            <StatusBar translucent backgroundColor="transparent" />
            <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
                <Left style={{ flex: 1 }}>
                    {parcelles && (
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
            <Content style={styles.content}>
                <View style={styles.mapview}>
                    <MapView
                        provider="google"
                        mapType="hybrid"
                        initialRegion={getRegion()}
                        style={styles.map}>

                        {parcelles.fields.map((field, idx) => {
                            return (
                                <Polygon
                                    key={field.id}
                                    strokeWidth={selectedFieldIdx === idx ? 4 : 1}
                                    strokeColor={selectedFieldIdx === idx ? '#fff' : COLORS.DARK_GREEN}
                                    fillColor={selectedFieldIdx === idx ? COLORS.CYAN : COLORS.DEFAULT_FIELD_MY}
                                    ref={ref => (polygons.current[idx] = ref)}
                                    onLayout={() => polygons.current[idx].setNativeProps({
                                        fillColor: selectedFieldIdx === idx ? COLORS.CYAN : COLORS.DEFAULT_FIELD_MY
                                    })}
                                    tappable={true}
                                    onPress={() => {
                                        let i = idx

                                        let newValue = selectedFieldIdx === i ? null : i
                                        setSelectedFieldIdx(newValue)
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

                    
                </View>
                <HygoCard>
                        {selectedFieldIdx !== null ? (
                            <Text style={styles.overlayText}>
                                {i18n.t('fields.culture', { value: i18n.t(`cultures.${parcelles.fields[selectedFieldIdx].culture_name}`) || i18n.t('fields.unknown') })}
                                {parcelles.fields[selectedFieldIdx].area ? `\n${i18n.t('fields.area', { value: (parcelles.fields[selectedFieldIdx].area / 10000).toFixed(2) })}` : ''}
                            </Text>
                        ) : (
                                <Text style={styles.overlayText}>{i18n.t('fields.parcelles', { value: parcelles.fields.length })}</Text>
                            )
                        }
                    </HygoCard>
            </Content>
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
    statusbar: { backgroundColor: 'black', flex: 1 },
    map: {
        justifyContent: "center",
        flexDirection: 'column',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
    },
    mapview: { 
        justifyContent: 'center', 
        flex: 1, display: 'flex', 
        paddingLeft: 15, 
        paddingRight: 15, 
        paddingBottom: 10,
        alignItems: 'center', 
        backgroundColor: COLORS.BEIGE },
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
    },
    content: {
        backgroundColor: COLORS.BEIGE
    },
    hygocard: {
        borderTopRightRadius: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: '#000000',
        shadowRadius: 2,
        shadowOpacity: .2,
        padding: 20,
        display: 'flex',
        elevation: 2,
        marginBottom: 10
    }
});


const mapStateToProps = (state) => ({
    parcelles: state.metadata.parcelles,
});

const mapDispatchToProps = (dispatch, props) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(FieldsScreen);