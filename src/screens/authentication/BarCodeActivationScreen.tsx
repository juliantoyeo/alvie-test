import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, View, Text, StatusBar, AsyncStorage, TextInput } from 'react-native';
import * as Linking from 'expo-linking';
import { Content, Header, Left, Right, Title, Form, Item, Input, Body, Button, Icon, Footer, Container } from 'native-base';
import { connect } from 'react-redux'
import { deleteToken } from '../../store/actions/authActions'
import COLORS from '../../colors';
import i18n from 'i18n-js';
import { Amplitude } from '../../amplitude'
import { updateAuthInfo } from '../../store/actions/authActions';
import { updatePhytoProductList, updatePulvInfo } from '../../store/actions/pulveActions'
import { updateParcellesList, updateCulturesList } from '../../store/actions/metaActions'
import { checkToken, activateDevice } from '../../api/hygoApi';
import HygoButton from '../../components/v2/HygoButton'
import { authValidate } from './authValidate';
import { HygoCard } from '../../components/v2/HygoCards';
import hygoStyles from '../../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface activationDataType {
    token: string,
    deviceid: string,
    userName: string,
    familyName: string,
    barcode,
    deviceType: string,
    hasEquipment: boolean,
    agri: number
}
const BarCodeActivationScreen = (props) => {
    const barcode = props.navigation.getParam('barcode', '');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [activationCode, setActivationCode] = useState<string>('');
    const url = "https://alvie.fr"
    const onPress = async () => {
        const { activationData, error } = await activateDevice(barcode, activationCode)
        if (!!activationData) {
            authValidate(activationData, false, props)
        }
        else {
            setErrorMessage("Code d'activiation erroné");
        }
    }
    const handleLink = async () => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);
    
        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          await Linking.openURL(url);
        }
    }
    return (
        <SafeAreaView style={[styles.statusbar, { backgroundColor: 'black' }]} forceInset={{ top: 'always' }}>
            <StatusBar translucent backgroundColor="transparent" />
            <Container contentContainerStyle={[styles.container, StyleSheet.absoluteFill]}>
            <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
                <Left style={{ flex: 1 }}>
                    <Button transparent onPress={() => props.navigation.replace('BarCode')}>
                        <Icon name='close' style={{ color: COLORS.DARK_GREEN }} />
                    </Button>
                </Left>
                <Body style={styles.headerBody}>
                    <Title style={styles.headerTitle}>Activation</Title>
                </Body>
                <Right style={{ flex: 1 }}></Right>
            </Header>
            <Content contentContainerStyle={styles.content}>
                <View>
                    <HygoCard title="Code d'activation">
                        <Text style={[hygoStyles.text, {paddingTop: 10, paddingLeft: 10}]}>Identifiant HYGO : {barcode}</Text>
                        <Form>
                            <Item>
                                <Input
                                    onChangeText={(text) => setActivationCode(text)}
                                    keyboardType='numeric'
                                    placeholder="0123456789"
                                />
                            </Item>
                        </Form>
                        <Text style={{paddingTop: 20, paddingLeft: 20, color: "red"}}>{errorMessage}</Text>
                    </HygoCard>
                    <Text style={[hygoStyles.text, {padding:20}]}>
                        Entrez le code d'activation que vous avez reçu par email.
                    </Text>
                    <Text style={[hygoStyles.text, {padding:20}]}>
                        Si vous n'avez rien reçu, merci de vous rapprocher de votre coopérative, ou bien rendez-vous sur :</Text>
                    <TouchableOpacity onPress={handleLink}>
                        <Text style={[hygoStyles.text, {padding:20, fontSize: 20, textAlign: 'center'}]}>{url}</Text>
                    </TouchableOpacity> 
                </View>
            </Content>
            <Footer style={styles.footer}>
                <HygoButton
                    onPress={onPress}
                    label="Activer HYGO"
                />
            </Footer>
            </Container>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    statusbar: { backgroundColor: COLORS.BEIGE, flex: 1 },
    container: { justifyContent: 'center', flex: 1, display: 'flex', justifyContent: 'center',paddingLeft: 38, paddingRight: 38, alignItems: 'center', backgroundColor: COLORS.BEIGE },
    containerSelect: { justifyContent: 'flex-start', flex: 1, display: 'flex', paddingLeft: 0, paddingRight: 15, backgroundColor: COLORS.BEIGE },

    header: {
        backgroundColor: COLORS.CYAN,
        paddingTop: 0
    },
    content: {
        backgroundColor: COLORS.BEIGE,
        flex:1,
        display: 'flex',
        justifyContent: 'center'
    },
    headerBody: {
        paddingTop: 0,
        flex: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

    },
    headerTitle: {
        color: '#fff',
        fontFamily: 'nunito-regular',
        fontSize: 24,
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
    loading: {
        color: COLORS.DARK_BLUE,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'nunito-regular'
    },
    text: {
        color: COLORS.DARK_GREEN,
        textAlign: 'center',
        fontSize: 18,
        flex: 1,
        fontFamily: 'nunito-regular'
    },
    buttonView: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    footer: {
        backgroundColor: COLORS.BEIGE
    },
});


const mapStateToProps = (state) => ({
    deviceid: state.authen.deviceid
})
const mapDispatchToProps = (dispatch, props) => ({
    updateAuthInfo: (params) => dispatch(updateAuthInfo(params)),
    updatePulvInfo: (params) => dispatch(updatePulvInfo(params)),
    checkToken: (token) => dispatch(checkToken(token)),
    updatePhytoProductList: (l) => dispatch(updatePhytoProductList(l)),
    updateParcellesList: (l) => dispatch(updateParcellesList(l)),
    updateCulturesList: (l) => dispatch(updateCulturesList(l)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BarCodeActivationScreen);