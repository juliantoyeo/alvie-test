import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import MapView, { Polygon } from 'react-native-maps';
import { updateParcellesList } from '../store/actions/metaActions'
import { SafeAreaView } from 'react-navigation';
import { Dimensions, StyleSheet, View, Text, StatusBar, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Left, Right, Body, Title, Header, Button, Icon, Content, Picker } from 'native-base';

import COLORS from '../colors';
import i18n from 'i18n-js';

import { getFields, updateField, getAllCultures } from '../api/hygoApi';

import { Amplitude, AMPLITUDE_EVENTS } from '../amplitude'
const { fieldsScreen: ampEvent } = AMPLITUDE_EVENTS


const Card = ({ field, cultureList, onUpdate }) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [name, setName] = useState<string>(field.name)
    const [cultureId, setCultureId] = useState<string>(field.culture_id)

    const confirmEdit = async () => {
        const newField = { id: field.id, name, cultureId: cultureId }
        await onUpdate(newField)
        setEditMode(!editMode)
    }
    const cancelEdit = () => {
        reset()
        setEditMode(!editMode)
    }
    const reset = () => {
        setName(field.name)
        setCultureId(field.culture_id)
    }
    useEffect(() => {
        reset()
    }, [field])

    return (
        <View>
            {editMode ? (
                //===========Card in Edit Mode==================//
                <View style={[styles.hygocard, { backgroundColor: '#fff' }]}>
                    <View style={styles.editButtons}>
                        <Button transparent onPress={cancelEdit}>
                            <Icon type='AntDesign' name='arrowleft' style={{ color: '#000', marginLeft:0 }} />
                        </Button>

                        <Button transparent onPress={confirmEdit}>
                            <Icon type='AntDesign' name='check' style={{ color: '#000', marginRight:0 }} />
                        </Button>
                    </View>

                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <TextInput
                            onChangeText={text => setName(text)}
                            value={name}
                            style={[{ textAlign: 'left' }, styles.overlayText]}
                        />
                    </View>
                    <View style={{ display: 'flex' ,flexDirection: 'row' }}>
                        <Picker
                            mode='dropdown'
                            itemTextStyle={styles.overlayText}
                            textStyle={[styles.overlayText, {paddingLeft:0}]}
                            // iosIcon={<Icon name="arrow-down" />} 
                            selectedValue={cultureId}
                            onValueChange={(v, i) => {
                                setCultureId(v)
                            }}
                        >
                            {cultureList.slice().sort(
                                (a,b) => (b.name >= a.name) ? -1 :  1
                            ).map(
                                (v, i) => <Picker.Item label={i18n.t(`cultures.${v.name.trim()}`)} value={v.id} key={i} />
                            )}
                        </Picker>

                    </View>
                </View>
            ) : (
                    //============== Card in View Mode =======================//
                    <View style={[styles.hygocard, { backgroundColor: '#fff' }]}>
                        <View style={[styles.editButtons, {flexDirection:'row-reverse'}]}>
                            <Button transparent onPress={() => { setEditMode(!editMode) }}>
                                <Icon type='AntDesign' name={editMode ? 'arrowleft' : 'edit'} style={{ color: '#000', marginRight:0 }} />
                            </Button>
                        </View>
                        <Text style={styles.overlayText}>{i18n.t('fields.name')} : {field.name}</Text>
                        <Text style={styles.overlayText}>
                            {i18n.t('fields.culture', { value: i18n.t(`cultures.${field.culture_name}`) || i18n.t('fields.unknown') })}
                        </Text>
                        <Text style={styles.overlayText}>
                            {field.area ? `${i18n.t('fields.area', { value: (field.area / 10000).toFixed(2) })}` : ''}
                        </Text>
                        
                    </View>
                )}
        </View>
    )
}



const FieldsScreen = ({ navigation, parcelles, updateParcellesList, cultures }) => {
    const [selectedFieldIdx, setSelectedFieldIdx] = useState<number>(null)
    const [cultureList, setCultureList] = useState<Array<any>>([])
    useEffect(() => {
        // console.log("Amplitude : ", ampEvent.render)
        Amplitude.logEventWithProperties(ampEvent.render, {
            timestamp: Date.now()
        })
    }, [])

    useEffect(() => {
        const getCultureList = async () => {
            const l = await getAllCultures()
            setCultureList(l)
        }
        getCultureList()
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

    const setField = async (newField) => {
        try {
            await updateField(newField)
            const fields = await getFields()
            updateParcellesList(fields)
        } catch (error) {

        }

    }

    //console.log(cultureList.sort((a,b) => (b.name >= a.name) ? -1 :  1))
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

                <View>
                    {selectedFieldIdx != null ? (
                        <Card
                            field={parcelles.fields[selectedFieldIdx]}
                            cultureList={cultureList}
                            onUpdate={setField} />
                    ) : (
                            <Text style={styles.overlayText}>{i18n.t('fields.parcelles', { value: parcelles.fields.length })}</Text>
                        )}
                </View>
            </Content>
        </SafeAreaView >
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
        paddingBottom: 20,
        alignItems: 'center',
        backgroundColor: COLORS.BEIGE
    },
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
        paddingTop: 5,
        display: 'flex',
        elevation: 2,
        marginBottom: 10
    },
    editButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row'
    }
});


const mapStateToProps = (state) => ({
    parcelles: state.metadata.parcelles,
    cultures: state.metadata.cultures,
});

const mapDispatchToProps = (dispatch, props) => ({
    updateParcellesList: (l) => dispatch(updateParcellesList(l)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FieldsScreen);