import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HygoButton from '../../components/v2/HygoButton';
import { ModulationContext } from '../../context/modulation.context';
import i18n from 'i18n-js'
import hygoStyles from '../../styles';
import COLORS from '../../colors';
import { fieldType } from '../../types/field.types';
import { cultureType } from '../../types/culture.types';
import { getFields_v2, getFieldsReturnType } from '../../api/hygoApi';

import { Amplitude, AMPLITUDE_EVENTS } from '../../amplitude'
import { setUserId } from 'expo-analytics-amplitude';
import ParcelSVG from '../../components/v2/ParcelSVG';

const { pulv2_parcel } = AMPLITUDE_EVENTS
// Amplitude.logEventWithProperties(pulv2_parcel.click_toPulv2Product, {
//     timestamp: Date.now(),
//     context
// })

interface ParcelListProps {
    title: string,
    items: Array<fieldType>,
    onPress: ((id: number, selected: boolean) => any),
    active: boolean
}

export const ParcelList = ({ title, items, onPress, active }: ParcelListProps) => {
    const [opened, setOpened] = useState(false)
    return (
        <View style={ListStyles.container}>
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <TouchableOpacity onPress={() => setOpened(!opened)}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#D1CFCF' }}>

                        {/* <Icon
                      type='AntDesign'
                      name={items.filter((it)=>it.selected == true).length > 0 ? 'arrowdown' : 'arrowright'}
                      style={{fontSize: 16, color: COLORS.CYAN}} /> */}

                        <Text style={[ListStyles.cardTitle, !active && ListStyles.hidden]}>{title}</Text>

                        <Icon
                            type='AntDesign'
                            name={opened ? 'down' : 'right'}
                            style={[{ fontSize: 16, color: COLORS.DARK_BLUE, padding: 10, paddingRight: 20 }, !active && ListStyles.hidden]}
                        />

                    </View>
                </TouchableOpacity>
                {opened &&
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: 10, paddingLeft: 20, paddingRight: 20 }}>
                        {items.map((item, k) => (
                            <TouchableOpacity
                                key={k}
                                onPress={() => { active && onPress(item.id, !item.selected) }}
                                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}
                                disabled={!active}
                            >
                                <Icon
                                    type='FontAwesome'
                                    name={item.selected ? 'square' : 'square-o'}
                                    style={[{ fontSize: 16, color: COLORS.DARK_BLUE, paddingTop: 3 }, !active && ListStyles.hidden]}
                                />
                                <View style={{ flex: 2, paddingLeft: 10 }}>
                                    <Text style={[hygoStyles.textBold, {color: '#888888'},!active && ListStyles.hidden, {paddingBottom:0}]}>
                                        {(item.name == 'unknown' ? (
                                            `Parcelle ${item.id}`
                                        ) : (
                                                `${item.id} - ${item.name}`
                                            ))}
                                    </Text>
                                    {item.nomCommune &&
                                        <Text style={[hygoStyles.text, !active && ListStyles.hidden]}>
                                            {item.nomCommune}
                                        </Text>}
                                </View>

                                <View style={{ flex: 1 }}>
                                    { item.svg && <ParcelSVG path={item.svg} height={30} width={30} /> }
                                </View>
                                <Text style={[hygoStyles.text, { textAlign: 'right' }, !active && ListStyles.hidden]}>
                                    {(item.area / 10000).toFixed(1)}ha
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                }
            </View>
        </View>

    )
}

interface selectParcelsScreenProps {
    navigation: any,
    cultures: Array<cultureType>
}

const SelectParcelsScreen = ({ navigation, cultures }: selectParcelsScreenProps) => {
    const context = React.useContext(ModulationContext)
    const [fields, setFields] = useState<Array<fieldType>>([])
    const [ready, setReady] = useState<boolean>(false)
    const [names, setNames] = useState<Array<string>>([])
    const [selectedName, setSelectedName] = useState<string>(null)

	console.log("===SelectParcelsScreen rendered")
    useEffect(() => {
        // Init fields and retrieve culture_names
        const load = async () => {
            context.setId(null)
            const { fields: fld }: getFieldsReturnType = await getFields_v2()
            if (!!fld) {
                setFields(fld)
                // filtering out useless cultures like "Jach??re", "Bande Tampon",...
                const fld_filter = fld.filter((f) => {
                    const c = cultures.find((c) => c.id == f.culture.id)
                    return !c.hidden
                })
                let nm = fld_filter.map((f) => f.culture.name).sort((a, b) => a.localeCompare(b))
                setNames([... new Set(nm)])     //delete duplicate
            }
        }
        if (fields.length == 0) {
            context.cleanFields()
            load()
        }
    }, [])

    useEffect(() => {
        setReady(context.selectedFields.length > 0)
        if (context.selectedFields.length == 0) {
            setSelectedName(null)
        }
    }, [context.selectedFields])

    const updateList = (id, newSelected) => {
        const touchedField = { ...fields.find((p) => p.id == id), selected: newSelected }
        setFields([...fields.filter((p) => p.id != id), touchedField])
        if (newSelected == true) {
            context.addField(touchedField)
            setSelectedName(touchedField.culture.name)
        } else {
            context.removeField(touchedField.id)
        }
    }
    return (
        <SafeAreaView style={styles.statusbar} forceInset={{ top: 'always' }}>
            <StatusBar translucent backgroundColor="transparent" />
            <Container contentContainerStyle={[styles.container, StyleSheet.absoluteFill]}>
                <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => navigation.navigate("main_v2")}>
                            <Icon type='AntDesign' name='arrowleft' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={styles.headerBody}>
                        <Title style={styles.headerTitle}>{i18n.t('pulve_parcelscreen.title')}</Title>
                        <Title style={styles.headerSubtitle}>{i18n.t('pulve_parcelscreen.subtitle')}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        <Button transparent onPress={() => navigation.navigate("main_v2")}>
                            <Icon type='AntDesign' name='close' style={{ color: '#fff' }} />
                        </Button>
                    </Right>
                </Header>
                <Content style={styles.content}>
                    <View>
                        <Text style={hygoStyles.h0}>{i18n.t('pulve_parcelscreen.parcels')}</Text>
                        {fields.length > 0 && names.length > 0 ? (
                            names.map((n, k) => {
                                const items: Array<fieldType> = fields.filter((f) => f.culture.name == n)
                                return (
                                    items.length > 0 &&
                                    <ParcelList
                                        key={k}
                                        title={n}
                                        items={items.sort((it1, it2) => it1.id - it2.id)}
                                        onPress={updateList}
                                        active={true} //{(!selectedName || n == selectedName)}
                                    />
                                )
                            })
                        ) : (<Spinner />)
                        }
                    </View>
                </Content>
                <Footer style={styles.footer}>
                    <HygoButton
                        label={i18n.t('pulve_parcelscreen.button_next').toUpperCase()}
                        onPress={async () => {
                            Amplitude.logEventWithProperties(pulv2_parcel.click_toPulv2Product, {
                                timestamp: Date.now(),
                                context
                            })
                            context.loadMeteo()
                            navigation.navigate('Pulverisation_Products')
                        }}
                        enabled={ready}
                        icon={{
                            type: 'AntDesign',
                            name: 'arrowright',
                            fontSize: 26
                        }}
                    />
                </Footer>
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
});

const buttonStyle = StyleSheet.create({
    inner: {
        backgroundColor: '#AFAEAE'
    }
});

const ListStyles = StyleSheet.create({
    container: {
        borderTopRightRadius: 20,
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowColor: '#000000',
        shadowRadius: 2,
        shadowOpacity: .2,
        display: 'flex',
        elevation: 2,
        marginBottom: 10,
    },
    cardTitle: {
        ...hygoStyles.h1,
        flex: 1,
        padding: 10,
        paddingLeft: 20
    },
    hidden: {
        color: '#DDD'
    }
})

const mapStateToProps = (state) => ({
    cultures: state.metadata.cultures,
});

const mapDispatchToProps = (dispatch, props) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(SelectParcelsScreen);
