import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer, Picker, Grid, Row, Col, Fab } from 'native-base';
import { FinderList } from './FinderList';
import HygoInputModal from './HygoInputModal';
import HygoPickerModal from './HygoPickerModal';
import HygoButton from '../../components/v2/HygoButton';
import { HygoCard } from '../../components/v2/HygoCards';
import { ModulationContext } from '../../context/modulation.context';
import { SnackbarContext } from '../../context/snackbar.context';
import i18n from 'i18n-js';
import COLORS from '../../colors';
import { BUSES } from '../../constants';

import hygoStyles from '../../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getEquipment, getActiveProducts, getActiveProductsReturnType, getFavorites, setFavorites } from '../../api/hygoApi';
import { activeProductType } from '../../types/activeproduct.types';
import { Snackbar } from 'react-native-paper';

import { Amplitude, AMPLITUDE_EVENTS } from '../../amplitude'
const { pulv2_product } = AMPLITUDE_EVENTS

import _ from 'lodash';

export const ProductList = ({ items, onPress }) => {
    return (
        <View style={productStyles.container}>
            <View style={{ minHeight: 26, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                {/* <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <TouchableOpacity onPress={()=>setOpened(!opened)}>
                        <Icon type='AntDesign' name={opened ? 'arrowdown' : 'arrowright'} style={{fontSize: 16}} />
                    </TouchableOpacity>
                </View> */}
                {items.map((item, k) => {
                    return (
                    <View key={k} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                        <TouchableOpacity onPress={() => { onPress(item.id) }}>
                            <Icon type='AntDesign' name='delete' style={{ fontSize: 16, paddingTop: 2, color: COLORS.DARK_BLUE }} />
                        </TouchableOpacity>
                        <Text style={[hygoStyles.text, { flex: 1, paddingLeft: 10 }]}>{item.name}</Text>
                        <Text style={hygoStyles.text}>{item.dose.toString() + ' L/ha'}</Text>
                    </View>
                )})}
            </View>
        </View>
    )
}

const SelectProductsScreen = ({ navigation }) => {
    const context = React.useContext(ModulationContext)
    const snackbar = React.useContext(SnackbarContext)
    const [products, setProducts] = useState<Array<activeProductType>>([])
    const [debitModalVisible, setDebitModalVisible] = useState<boolean>(true)
    const [viewMode, setViewMode] = useState<boolean>(true)
    const [families, setFamilies] = useState<Array<string>>([])
    const totalArea = context.selectedFields.reduce((r, f) => r + f.area / 10000, 0)    //converted to ha
    const [favs, setFavs] = useState<Array<number>>([])

    useEffect(() => {
        // Init product list and retrieve product families and favorites
        const load = async () => {
            const prd: Array<activeProductType> = await getActiveProducts()
            if (prd.length > 0) {
                setProducts(prd)
                const nm = prd.map((f) => f.phytoproduct.name)
                setFamilies(_.uniq(nm))     //delete duplicate
            }
        }
        if (products.length == 0) {
            context.cleanProducts()
            load()
        }
    }, [])

    // init equipment
    useEffect(() => {
        const load = async () => {
            const equ = await getEquipment()
            context.setBuses(equ.buses)
        }
        load()
    }, [])

    // Init favorites
    useEffect(() => {
        const load = async () => {
            const favs: Array<number> = await getFavorites()
            if (favs.length > 0) {
                setFavs(favs)
            }
        }
        load()
    }, [])

    const removeProduct = (id) => {
        context.removeProduct(id)
        const item: any = products.find((p) => p.id == id)
        setProducts([...products.filter((p) => p.id != id), { ...item, selected: false }])
    }

    const Cuve = () => {
        const [buseModalVisible, setBuseModalVisible] = useState<boolean>(false)
        const changeBuses = () => {
            Amplitude.logEventWithProperties(pulv2_product.click_buses, {
                timestamp: Date.now(),
                context
            })
            setBuseModalVisible(true)
        }
        return (

            <View>
                <Text style={hygoStyles.h0}>{i18n.t('pulve_productscreen.cuve')}</Text>
                <HygoCard>
                    <View style={styles.grid}>
                        <View style={styles.row}>
                            <Text style={styles.colLeft}>{i18n.t('pulve_productscreen.debit')}</Text>
                            <TouchableOpacity onPress={() => setDebitModalVisible(true)}>
                                <Text style={styles.colRight}>{context.debit} L/ha</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.colLeft}>{i18n.t('pulve_productscreen.buse')}</Text>
                            <TouchableOpacity onPress={() => changeBuses()}>
                                <Text style={styles.colRight}>{i18n.t(`equipment.${context.buses}`)}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.colLeft}>{i18n.t('pulve_productscreen.bouillie')}</Text>
                            <Text style={[styles.colRight, { borderWidth: 0 }]}>{(context.debit * totalArea).toFixed(1)} L</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.colLeft}>{i18n.t('pulve_productscreen.surface')}</Text>
                            <Text style={[styles.colRight, { borderWidth: 0 }]}>{(totalArea).toFixed(1)} ha</Text>
                        </View>
                    </View>
                </HygoCard>
                <HygoPickerModal
                    onClose={() => { }}
                    modalVisible={buseModalVisible}
                    setModalVisible={setBuseModalVisible}
                    defaultValue={i18n.t(`equipment.${context.buses}`)}
                    items={BUSES.map((b) => i18n.t(`equipment.${b}`))}
                    setInput={(item) => {
                        const i = BUSES.map((b) => i18n.t(`equipment.${b}`)).indexOf(item)
                        context.setBuses(BUSES[i])
                    }}
                    
                    title={i18n.t('pulve_productscreen.modal_buses')}
                />
            </View >
        )
    }
    const Recap = () => (
        <View>
            {context.selectedProducts.length > 0 ? (
                <ProductList
                    items={context.selectedProducts.slice().sort((it1, it2) => it1.name.localeCompare(it2.name))}
                    onPress={(id) => removeProduct(id)}
                />
            ) : (
                    <Text style={[hygoStyles.h0, { textAlign: 'center' }]}>{i18n.t('pulve_productscreen.info')}</Text>
                )}
        </View>
    )

    const Finder = () => {
        const [doseModalVisible, setDoseModalVisible] = useState<boolean>(false)
        const [select, setSelect] = useState<activeProductType>()
        const [search, setSearch] = useState<string>('')
        const addProduct = (item: activeProductType) => {
            //Append to the list of product selected
            setSelect(item)
            setDoseModalVisible(true)

        }
        const updateFavs = (item: activeProductType) => {
            const stack = favs.concat(item.id)
            const st = _.uniq(stack)   //delete duplicate
            if (st.length > 10) {
                st.shift()
            }
            setFavs(st)
            setFavorites(st)
        }
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.searchbox}>
                    <Icon type='AntDesign' name='search1' style={{ color: search == '' ? "#aaa" : COLORS.DARK_BLUE }} />
                    <TextInput
                        onChangeText={text => setSearch(text)}
                        value={search}
                        placeholder={i18n.t('pulve_productscreen.search')}
                        style={[hygoStyles.text, { textAlign: 'left', color: "#000", paddingLeft: 10, flex: 1, paddingBottom: 0 }]}
                    />
                </View>
                {favs.length > 0 &&
                    <FinderList
                        title={i18n.t('pulve_productscreen.favoris')}
                        items={favs.map((f) => products.find((p) => p.id == f)).filter((f) => !!f)}
                        onPress={addProduct}
                        collapseEnabled={search != ''}
                    />
                }
                {families.length > 0 && families.map((f, k) => {
                    const items: Array<activeProductType> = products.filter((p) => p.phytoproduct.name == f && p.name.toLowerCase().match(search.toLowerCase()))
                    return (
                        items.length > 0 &&
                        <FinderList
                            key={k}
                            title={i18n.t(`products.${f}`)}
                            items={items.sort((it1, it2) => it1.id - it2.id)}
                            onPress={addProduct}
                            collapseEnabled={search != ''}
                        />
                    )
                })}
                <HygoInputModal
                    onClose={() => { }}
                    onSuccess={(item) => { snackbar.showSnackbar(i18n.t('pulve_productscreen.snack_add'), 'OK'); updateFavs(item) }}
                    modalVisible={doseModalVisible}
                    setModalVisible={setDoseModalVisible}
                    defaultValue={'0.6'}
                    setInput={(str) => {
                        const newItem: activeProductType = { ...select, selected: true }
                        context.addProduct({ ...newItem, dose: parseFloat(str) })
                        setProducts([...products.filter((p) => p.id != select.id), newItem])
                    }}
                    title={select && i18n.t('pulve_productscreen.modal_product', {product: select.name})}
                    item={select}
                />
            </View>
        )
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
                        <Title style={styles.headerTitle}>{i18n.t('pulve_productscreen.title')}</Title>
                        <Title style={styles.headerSubtitle}>{i18n.t('pulve_productscreen.subtitle')}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        <Button transparent onPress={() => navigation.navigate("main_v2")}>
                            <Icon type='AntDesign' name='close' style={{ color: '#fff' }} />
                        </Button>
                    </Right>
                </Header>
                <Content style={styles.content}>
                    <HygoInputModal
                        onClose={() => { }}
                        modalVisible={debitModalVisible}
                        setModalVisible={setDebitModalVisible}
                        defaultValue={context.debit.toString()}
                        setInput={(str) => context.setDebit(parseInt(str))}
                        title={i18n.t('pulve_productscreen.modal_debit')}
                        onSuccess={() => { }}
                        item={{}}
                    />

                    <Cuve />

                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={hygoStyles.h0}>{i18n.t('pulve_productscreen.products')}</Text>
                        <TouchableOpacity onPress={() => { setViewMode(!viewMode) }} >
                            {viewMode && <Icon type='AntDesign' name='pluscircleo' style={styles.iconTitle} />}
                        </TouchableOpacity>
                    </View>
                    {viewMode ? <Recap /> : <Finder />}
                </Content>
                {viewMode ? (
                    <Footer style={styles.footer}>
                        <HygoButton
                            label={i18n.t('pulve_productscreen.button_next').toUpperCase()}
                            onPress={() => {
                                Amplitude.logEventWithProperties(pulv2_product.click_toPulv2Slot, {
                                    timestamp: Date.now(),
                                    context
                                })
                                navigation.navigate('Pulverisation_Slot')
                            }
                            }
                            icon={{
                                type: 'AntDesign',
                                name: 'arrowright',
                                fontSize: 26,
                            }}
                            enabled={context.selectedProducts.length > 0}
                        />
                    </Footer>
                ) : (
                        <Fab
                            active={true}
                            direction="left"
                            //containerStyle={{ marginLeft: 10 }}
                            style={styles.fab}
                            position="bottomRight"
                            onPress={() => { setViewMode(!viewMode) }}
                        >
                            <Icon type='AntDesign' name={'check'} />
                        </Fab>
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
    content: {
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
        color: COLORS.DARK_BLUE
    },
    iconTitle: {
        color: COLORS.DARK_BLUE,
        padding: 10,
    },
    footer: {
        backgroundColor: COLORS.BEIGE
    },
    fab: {
        backgroundColor: COLORS.DARK_BLUE
    },
    grid: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column'
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingBottom: 5
    },
    colRight: {
        ...hygoStyles.text,
        textAlign: 'right',
        borderWidth: 1,
        borderColor: '#AAA',
        flex: 1,
        padding: 2,
        paddingBottom: 2
    },
    colLeft: {
        ...hygoStyles.text,
        flex: 3,
        padding: 2,
        paddingBottom: 2
    },
    searchbox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: "#fff"
    }
});

const productStyles = StyleSheet.create({
    container: {
        borderTopRightRadius: 20,
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowColor: '#000000',
        shadowRadius: 2,
        shadowOpacity: .2,
        padding: 20,
        display: 'flex',
        elevation: 2,
        marginBottom: 10
    },
    cardTitle: {
        textTransform: 'uppercase',
        fontFamily: 'nunito-bold',
        fontSize: 14,
        flex: 1,
        color: COLORS.CYAN
    }
})

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch, props) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(SelectProductsScreen);