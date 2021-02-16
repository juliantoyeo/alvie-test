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
                                <Text style={[hygoStyles.text, { flex: 1, paddingLeft: 10 }, !active && ListStyles.hidden]}>
                                    {item.name == 'unknown' ? (
                                        `Parcelle ${item.id}`
                                    ) : (
                                            `${item.id} - ${item.name}`
                                        )}
                                </Text>
                                <ParcelSVG 
                                    path="M 500160.8882 -6618953.609 L 500161.456100002 -6618965.6359 500163.498100005 -6618978.5698 500169.625100002 -6618998.6529 500177.567100003 -6619018.8489 500182.1061 -6619029.8549 500182.787100002 -6619041.4278 500187.098099999 -6619068.7719 500190.729100004 -6619092.0319 500196.7421 -6619115.1778 500202.869100004 -6619137.53 500202.075199999 -6619145.812 500202.075100005 -6619158.86 500200.146200001 -6619185.4099 500202.302100003 -6619195.7348 500202.529100001 -6619195.7348 500202.756099999 -6619206.0599 500204.004100002 -6619213.7757 500333.576700002 -6619172.0218 500327.676800005 -6619160.5618 500327.789700001 -6619160.5618 500319.620800003 -6619132.424 500317.4648 -6619120.284 500313.947800003 -6619107.803 500308.728799999 -6619079.891 500306.458800003 -6619069.453 500302.487800002 -6619045.172 500292.843800001 -6619021.345 500288.305799998 -6619002.851 500283.993799999 -6618978.797 500280.7038 -6618949.638 500271.639800005 -6618929.0391 500261.868799999 -6618922.1801 500246.437899999 -6618915.0321 500219.887900002 -6618906.4091 500209.449900001 -6618905.6151 500189.027000003 -6618903.9132 500176.206 -6618905.5011 500166.788000003 -6618908.1111 500163.158200003 -6618910.1531 500164.065099999 -6618921.2719 500165.654100001 -6618942.4899 500165.540100001 -6618947.028 Z"
                                    height={30} width={30}
                                />
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

    useEffect(() => {
        // Init fields and retrieve culture_names
        const load = async () => {
            context.setId(null)
            const { fields: fld }: getFieldsReturnType = await getFields_v2()
            if (!!fld) {
                setFields(fld)
                // filtering out useless cultures like "Jachère", "Bande Tampon",...
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