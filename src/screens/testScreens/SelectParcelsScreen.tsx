import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer } from 'native-base';
//import { HygoList } from './ParcelList';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HygoButton from '../../components/v2/HygoButton';
import { getInterventions } from '../../api/hygoApi';
import { ModulationContext } from '../../context/modulation.context';
import i18n from 'i18n-js'
import hygoStyles from '../../styles';
import COLORS from '../../colors';
import { Amplitude, AMPLITUDE_EVENTS } from '../../amplitude'
const { selectParcelsScreen: ampEvent } = AMPLITUDE_EVENTS
import { fieldType } from '../../types/field.types';
import { fieldsData } from './staticData';
import { getFields, getFieldsReturnType } from '../../api/hygoApi';
import { errorType, isError } from '../../types/error.types';
const types = ["ble", "mais", "orge"]

interface HygoListProps {
    title: string,
    items: Array<fieldType>,
    onPress: ((id: number, selected: boolean) => any)
}

interface fieldsInterface { 
    fields: Array<fieldType>
}

export const HygoList = ({ title, items, onPress }: HygoListProps) => {
    const [opened, setOpened] = useState(true)
    return (
        <View style={ListStyles.container}>
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#D1CFCF' }}>

                    {/* <Icon 
                      type='AntDesign' 
                      name={items.filter((it)=>it.selected == true).length > 0 ? 'arrowdown' : 'arrowright'} 
                      style={{fontSize: 16, color: COLORS.CYAN}} /> */}

                    <Text style={ListStyles.cardTitle}>{title}</Text>
                    <TouchableOpacity onPress={() => setOpened(!opened)}>
                        <Icon
                            type='AntDesign'
                            name={opened ? 'down' : 'right'}
                            style={{ fontSize: 16, color: COLORS.DARK_BLUE, padding: 10, paddingRight: 20 }}
                        />
                    </TouchableOpacity>
                </View>
                {opened &&
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: 10, paddingLeft: 20, paddingRight: 20 }}>
                        {items.map((item, k) => (
                            <TouchableOpacity
                                key={k}
                                onPress={() => { onPress(item.id, !item.selected) }}
                                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}
                            >
                                <Icon
                                    type='FontAwesome'
                                    name={item.selected ? 'square' : 'square-o'}
                                    style={{ fontSize: 16, color: COLORS.DARK_BLUE, paddingTop: 3 }}
                                />
                                <Text style={[hygoStyles.text, { flex: 1, paddingLeft: 10 }]}>name here - {item.id/*item.name*/}</Text>
                                <Text style={[hygoStyles.text, { textAlign: 'right' }]}>{(item.area / 10000).toFixed(1)}ha</Text>
                            </TouchableOpacity>

                        ))}
                    </View>
                }
            </View>
        </View>

    )
}

const SelectParcelsScreen = ({ navigation }) => {
    const context = React.useContext(ModulationContext)
    const [fields, setFields] = useState<Array<fieldType>>([])
    const [ready, setReady] = useState<boolean>(false)
    const [names, setNames] = useState<Array<string>>([])

    useEffect(() => {
        // Init fields and retrieve culture_names
        const loadFields = async () => {
           
            const {fields: fld}: getFieldsReturnType = await getFields()
            if (!isError(fld)) {
                setFields(fld)
                const nm = fld.map( (f) => f.culture_name)
                setNames([... new Set(nm)])     //delete duplicate
            }
        }
        if (fields.length == 0) {
            context.cleanFields()
            loadFields()
        }
    }, [])

    useEffect(() => {
        setReady(context.selectedFields.length > 0)
    }, [context.selectedFields])

    const updateList = (id, newSelected) => {
        const touchedField = { ...fields.find((p) => p.id == id), selected: newSelected }
        setFields([...fields.filter((p) => p.id != id), touchedField])
        if (newSelected == true) {
            context.addField(touchedField)
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
                        <Button transparent onPress={() => navigation.goBack()}>
                            <Icon type='AntDesign' name='arrowleft' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={styles.headerBody}>
                        <Title style={styles.headerTitle}>Pulvérisation</Title>
                        <Title style={styles.headerTitle}>Choix des parcelles</Title>
                    </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>
                <Content style={styles.content}>
                    <View>
                        <Text style={hygoStyles.h0}>Mes Parcelles</Text>
                        {fields.length != 0 && names.length != 0 &&
                            names.map((n, k) => {
                                const items: Array<fieldType> = fields.filter((p) => p.culture_name == n)
                                return (
                                    items.length > 0 &&
                                    <HygoList key={k} title={n} items={items.sort((it1, it2) => it1.id - it2.id)} onPress={updateList} />
                                )
                            })}
                    </View>
                </Content>
                <Footer style={styles.footer}>
                    <HygoButton
                        label="CHOIX DES PRODUITS"
                        onPress={() => { navigation.navigate('TestPageProducts') }}
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
})

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch, props) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(SelectParcelsScreen);