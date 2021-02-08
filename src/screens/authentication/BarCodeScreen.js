import * as React from 'react';
import { StyleSheet, StatusBar, ImageBackground, View, AsyncStorage } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Text } from 'react-native-elements';
import { Content, Spinner } from 'native-base';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { connect } from 'react-redux';
import { updateAuthInfo } from '../../store/actions/authActions';
import { updatePhytoProductList, updatePulvInfo } from '../../store/actions/pulveActions'
import { updateParcellesList, updateCulturesList } from '../../store/actions/metaActions'
import { signInWithBarCode, checkToken, storePushToken, getPhytoProducts, getFields, getCultures, checkSetup } from '../../api/hygoApi';
import { Notifications } from 'expo';
//import { getLocationPermissionAsync } from '../geolocation'
import * as Device from 'expo-device';
import COLORS from '../../colors'
import i18n from 'i18n-js';
import HygoButton from '../../components/HygoButton'
import LogoLoading from '../../components/LogoLoading'
import pkg from '../../../app.json'
import { OTA } from '../../constants'

import { Amplitude, AMPLITUDE_EVENTS } from '../../amplitude'

const { barCodeScreen: ampEvent } = AMPLITUDE_EVENTS

const v2Devices = ["BE72FC"]

class BarCodeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasCameraPermission: null,
            scanned: false,
            loading: true,
            tokenLoading: false,
            qrError: null
        };
    }
    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });

        if (!Device.isDevice) {
            let code = await BarCodeScanner.scanFromURLAsync('https://alvie-mvp.s3-eu-west-1.amazonaws.com/QRcode-FFFFFF.png')//'https://alvie-mvp.s3-eu-west-1.amazonaws.com/qr-code30.png') //'https://alvie-mvp.s3-eu-west-1.amazonaws.com/qr-code8+(1).png') // 'https://alvie-mvp.s3-eu-west-1.amazonaws.com/barcode+test.png')//
            this.handleBarCodeScanned(code[0])
        }
    };

    registerForPushNotificationsAsync = async (deviceid) => {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
            return;
        }
        // Get the token that identifies this device
        const pushToken = await Notifications.getExpoPushTokenAsync();

        // POST the token to the backend server
        return storePushToken(pushToken, deviceid)
    }

    async componentDidMount() {
        //await getLocationPermissionAsync(i18n.t('geolocation.text'))

        this.props.updatePhytoProductList(await getPhytoProducts())

        let storedToken = await AsyncStorage.getItem('token');
        let { errorMessage, userName, familyName, deviceid, deviceType, hasEquipment, tester } = await checkToken(storedToken);

        if (!errorMessage) {
            await this.gotoNextScreen(storedToken, userName, familyName, deviceid, deviceType, hasEquipment, tester)
        } else if (errorMessage == 'INVALID_CODE') {
            this.props.navigation.replace('BarCodeActivationScreen', {barcode: data})
        } else {
            this.setState({ loading: false, qrError: errorMessage })
            this.getPermissionsAsync();
        }
    }

    gotoNextScreen = async (token, userName, familyName, deviceid, deviceType, hasEquipment, tester) => {
        await AsyncStorage.setItem('token', token);

        Amplitude.setUserId(`${deviceid}-${userName}-${familyName}`)
        // console.log("Amplitude : ", ampEvent.loggedin)
        Amplitude.logEventWithProperties(ampEvent.loggedin, {
            timestamp: Date.now(),
            token,
            userName,
            familyName,
            deviceid,
            deviceType,
            hasEquipment
        })

        let phytoProductSelected = await AsyncStorage.getItem('phytoProductSelected');
        let culturesSelected = await AsyncStorage.getItem('culturesSelected');
        await this.props.updateAuthInfo({
            token,
            userName, familyName, deviceid, deviceType, tester
        })
        phytoProductSelected = phytoProductSelected == null ? [] : JSON.parse(phytoProductSelected)
        culturesSelected = culturesSelected == null ? [] : JSON.parse(culturesSelected)

        await this.props.updatePulvInfo({
            phytoProductSelected,
            culturesSelected
        })

        const { result, error } = await checkSetup()
        if (!result)
            this.props.navigation.replace('WaitActivation', { error });
        else {
            let [fields, cultures] = await Promise.all([
                getFields(),
                getCultures(),
            ])
            this.props.updateParcellesList(fields)
            this.props.updateCulturesList(cultures)

            // TODO debug this
            // await this.registerForPushNotificationsAsync(deviceid)

            if (hasEquipment) {
                this.props.navigation.replace('main_v2');
            } else {
                this.props.navigation.replace('BarCodeValidation')
            }
        }
    }


    handleBarCodeScanned = async ({ type, data }) => {
        this.setState({ tokenLoading: true });
        const { token, errorMessage, userName, familyName, deviceid, deviceType, hasEquipment } = await signInWithBarCode(data);
        if (!errorMessage && token) {
            await this.gotoNextScreen(token, userName, familyName, deviceid, deviceType, hasEquipment)
        } else if (errorMessage == 'INVALID_CODE') {
            this.props.navigation.replace('BarCodeActivationScreen', {barcode: data})
        } else {
            this.setState({ qrError: errorMessage })
            this.setState({ tokenLoading: false });
            this.setState({ scanned: true });

        }
    };

    render() {
        const { hasCameraPermission, scanned, tokenLoading } = this.state;

        return (
            <SafeAreaView style={[styles.statusbar, { backgroundColor: 'black', flex: 1, display: 'flex' }]} forceInset={{ top: 'always' }}>
                { this.state.loading && (
                    <React.Fragment>
                        <StatusBar translucent backgroundColor="transparent" />
                        <ImageBackground source={require('../../../assets/blue_back.png')} imageStyle={{ resizeMode: 'cover', flex: 1 }} style={styles.container}>
                            <View style={[StyleSheet.absoluteFill, { flex: 1, backgroundColor: '#000', opacity: .6 }]}></View>
                            <View style={{ display: 'flex', alignItems: 'center' }}>
                                <LogoLoading duration={1000} color={"#fff"} />
                            </View>
                        </ImageBackground>
                    </React.Fragment>
                )}

                { !this.state.loading && hasCameraPermission === false && (
                    <Content contentContainerStyle={{ justifyContent: 'center', flex: 1, padding: 20 }}>
                        <Text style={{
                            color: COLORS.DARK_BLUE,
                            textAlign: 'center',
                            fontSize: 24,
                            fontFamily: 'nunito-regular'
                        }}>{i18n.t('bar_code.camera_description')}</Text>

                        <View style={[StyleSheet.absoluteFill, {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }]}>

                            <HygoButton onPress={() => this.getPermissionsAsync()} label={i18n.t('bar_code.retry_camera')} icon={{
                                type: 'EvilIcons',
                                name: 'refresh'
                            }} />
                        </View>
                    </Content>
                )}

                { !this.state.loading && hasCameraPermission && (
                    <BarCodeScanner
                        onBarCodeScanned={scanned || tokenLoading ? undefined : this.handleBarCodeScanned}
                        style={[StyleSheet.absoluteFill, { display: 'flex' }]}>
                        <View style={{
                            backgroundColor: COLORS.BEIGE,
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 36,
                            paddingTop: 90,
                            justifyContent: 'center'
                        }}>

                            <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Text textAlign="center" style={{
                                    color: COLORS.DARK_BLUE,
                                    textAlign: 'center',
                                    fontSize: 24,
                                    flex: 1,
                                    fontFamily: 'nunito-regular'
                                }}>{i18n.t('bar_code.welcome')}</Text>

                                <Text textAlign="center" style={{
                                    color: COLORS.DARK_GREEN,
                                    textAlign: 'center',
                                    fontSize: 18,
                                    flex: 1,
                                    fontFamily: 'nunito-regular'
                                }}>{i18n.t('bar_code.notice')}</Text>
                            </View>
                        </View>
                        <View style={{ height: 300, display: 'flex', flexDirection: 'row', backgroundColor: tokenLoading ? '#000' : 'transparent' }}>
                            <View style={{ backgroundColor: COLORS.BEIGE, flex: 1 }}></View>
                            <View style={{ backgroundColor: scanned || tokenLoading ? 'rgba(255, 255, 255, .6)' : 'transparent', flexDirection: 'column', width: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {scanned && (
                                    <Text textAlign="center" style={{
                                        color: COLORS.DARK_BLUE,
                                        textAlign: 'center',
                                        fontSize: 24,
                                        fontFamily: 'nunito-bold'
                                    }}>{i18n.t(`bar_code.qr_error.${this.state.qrError == 'SIGNIN_ERROR' ? 'signin' : 'network'}`)}</Text>
                                )}

                                {tokenLoading && (
                                    <Spinner color={COLORS.DARK_BLUE} />
                                )}
                            </View>
                            <View style={{ backgroundColor: COLORS.BEIGE, flex: 1 }}></View>
                        </View>
                        <View style={{ backgroundColor: COLORS.BEIGE, height: 90, paddingTop: 10 }}>
                            <Text textAlign="center" style={styles.text}> {`${i18n.t('drawer.app_version', { version: pkg.expo.version })} | ${i18n.t('drawer.build_number', { build: pkg.extra.build })} - ${OTA}`} </Text>

                        </View>
                    </BarCodeScanner>
                )}

                <View style={[StyleSheet.absoluteFill, {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                }]}>

                    {scanned && (
                        <HygoButton onPress={() => this.setState({ scanned: false })} label={i18n.t('bar_code.retry_barcode')} icon={{
                            type: 'EvilIcons',
                            name: 'refresh'
                        }} />
                    )}
                </View>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        display: 'flex',
        paddingLeft: 38,
        paddingRight: 38,
        alignItems: 'center',
        resizeMode: 'cover'
    },
    text: {
        color: COLORS.DARK_GREEN,
        textAlign: 'center',
        fontSize: 10,
        flex: 1,
        fontFamily: 'nunito-regular'
    }
})

BarCodeScreen.navigationOptions = () => {
    return {
        header: null
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(BarCodeScreen);